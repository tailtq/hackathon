import Https from 'https';
import Url from 'url';
import Rooms from '../Helpers/rooms';
import * as Common from '../Helpers/common';
import Config from '../../../config/webrtc';
import BaseController from '../../../infrastructure/Controllers/BaseController';

const rooms = new Rooms();

class LiveStreamController extends BaseController {
  index(req, res) {
    const params = Common.getRoomParameters(req, null, null, null);

    return res.render('app/client/livestream/index', params);
  }

  join(req, res) {
    var roomId = req.params.roomId;
    var clientId = Common.generateRandom(8);
    var isLoopback = req.params.debug == 'loopback';
    var response = null;

    this.addClientToRoom(req, roomId, clientId, isLoopback, function(error, result) {
      if (error) {
        console.error('Error adding client to room: ' + error + ', room_state=' + result.room_state);
        response = {
          result: error,
          params: result
        };
        return res.json(response);
      }
      var params = Common.getRoomParameters(req, roomId, clientId, result.is_initiator);
      params.messages = result.messages;
      response = {
        result: 'SUCCESS',
        params: params
      };

      return res.json(response);
    });
  }

  message(req, res) {
    var userAgent = req.headers['user-agent'];
    var roomId = req.params.roomId;
    var clientId = req.params.clientId;
    var message = null;
    var response = null;

    console.log('User ' + clientId + ' - ' + userAgent);
    if (userAgent.indexOf('CFNetwork') > -1) {
      var malformed_sdp = JSON.parse(req.text);
      var keys = Object.keys(malformed_sdp);
      var key = keys[0];
      var value = malformed_sdp[key];
      var sdp = key + '=' + value;
      message = sdp;

      if (message.slice(-1) == '=') {
        message = message.slice(0, -1);
      }
    } else {
      message = JSON.parse(req.text);
    }
    const self = this;

    this.saveMessageFromClient(req.headers['host'], roomId, clientId, message, function (error, result) {
      if (error) {
        response = {
          result: error
        };
        return res.json(response);
      }

      if (result) {
        response = {
          result: 'SUCCESS'
        };
        return res.json(response);
      } else {
        self.sendMessageToCollider(req, roomId, clientId, message, function (error, result) {
          if (error) {
            return res.json('').status(500);
          }

          if (result) {
            return res.json(result);
          }
        });
      }
    });
  }

  addClientToRoom(req, roomId, clientId, isLoopback, callback) {
    var key = Common.getCacheKeyForRoom(req.headers.host, roomId);

    rooms.createIfNotExist(key, function (error, room) {
      var error = null;
      var isInitiator = false;
      var messages = [];
      var occupancy = room.getOccupancy();

      if (occupancy >= 2) {
        error = Config.constant.RESPONSE_ROOM_FULL;
        callback(error, {
          messages: messages,
          room_state: room.toString()
        });

        return;
      } else if (room.hasClient(clientId)) {
        error = Config.constant.RESPONSE_DUPLICATE_CLIENT;
        callback(error, {
          messages: messages,
          room_state: room.toString()
        });

        return;
      } else {
        room.join(clientId, function (error, client, otherClient) {
          if (error) {
            callback(error, {
              messages: messages,
              room_state: null
            });

            return;
          }

          if (client.isInitiator && isLoopback) {
            room.join(Config.constant.LOOPBACK_CLIENT_ID);
          }

          var messages = otherClient ? otherClient.messages : messages;

          if (otherClient) otherClient.clearMessages();

          console.log('Added client ' + clientId + ' in room ' + roomId);
          callback(null, {
            is_initiator: client.isInitiator,
            messages: messages,
            room_state: room.toString()
          });
        });
      }
    });
  }

  saveMessageFromClient(host, roomId, clientId, message, callback) {
    const text = message;
    const key = Common.getCacheKeyForRoom(host, roomId);

    rooms.get(key, function (error, room) {
      if (!room) {
        callback({ error: Config.constant.RESPONSE_UNKNOWN_ROOM });
        return;
      } else if (!room.hasClient(clientId)) {
        callback({ error: Config.constant.RESPONSE_UNKNOWN_CLIENT });
        return;
      } else if (room.getOccupancy() > 1) {
        callback(null, false);
      } else {
        var client = room.getClient(clientId);
        client.addMessage(text);
        console.log('Saved message for client ' + clientId + ':' + client.toString() + ' in room ' + roomId);
        callback(null, true);
        return;
      }
    });
  }

  sendMessageToCollider(req, roomId, clientId, message, callback) {
    console.log('Forwarding message to collider from room ' + roomId + ' client ' + clientId);
    var wssParams = Common.getWSSParameters(req);
    var wssHost = Url.parse(wssParams.wssPostUrl);
    var postOptions = {
      host: wssHost.hostname,
      port: wssHost.port,
      path: '/' + roomId + '/' + clientId,
      method: 'POST'
    };

    const postRequest = Https.request(postOptions, function (result) {
      if (result.statusCode === 200) {
        callback(null, {
          result: 'SUCCESS'
        });
        return;
      } else {
        callback(result.statusCode);
        return;
      }
    });
    message = typeof message === 'string' ? message : JSON.stringify(message);
    postRequest.write(message);
    postRequest.end();
  };
}

export default LiveStreamController;
