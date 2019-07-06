import * as Common from '../Helpers/common';
import Config from '../../../config/webrtc';
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Rooms from '../Helpers/rooms';

const rooms = new Rooms();

class RoomController extends BaseController {
  index(req, res) {
    var roomId = req.params.roomId;
    var key = Common.getCacheKeyForRoom(req.headers['host'], roomId);

    rooms.get(key, function (error, room) {
      if (room) {
        console.log('Room ' + roomId + ' has state ' + room.toString());

        if (room.getOccupancy() >= 2) {
          console.log('Room ' + roomId + ' is full');
          return res.render('full_template', {});

          return;
        }
      }

      var params = Common.getRoomParameters(req, roomId, null, null);
      return res.render('app/client/livestream/index', params);
    });
  }

  leave(req, res) {
    var roomId = req.params.roomId;
    var clientId = req.params.clientId;

    this.removeClientFromRoom(req.headers['host'], roomId, clientId, function (error, result) {
      if (error) {
        console.log('Room ' + roomId + ' has state ' + result.room_state);
      }

      console.log('Room ' + roomId + ' has state ' + result.room_state);
      return res.json('');
    });
  }

  removeClientFromRoom(host, roomId, clientId, callback) {
    var key = Common.getCacheKeyForRoom(host, roomId);
    console.log(host, roomId);

    rooms.get(key, function (error, room) {
      if (!room) {
        console.warn('remove_client_from_room: Unknown room: ' + roomId);
        callback(Config.constant.RESPONSE_UNKNOWN_ROOM, {
          room_state: null
        });

        return;
      } else if (!room.hasClient(clientId)) {
        console.warn('remove_client_from_room: Unknown client: ' + clientId);
        callback(Config.constant.RESPONSE_UNKNOWN_CLIENT, {
          room_state: null
        });

        return;
      } else {
        room.removeClient(clientId, function (error, isRemoved, otherClient) {
          if (room.hasClient(Config.constant.LOOPBACK_CLIENT_ID)) {
            room.removeClient(Config.constant.LOOPBACK_CLIENT_ID, function (error, isRemoved) {
              return;
            });
          } else {
            if (otherClient) {
              otherClient.isInitiator = true;
            }
          }

          callback(null, {
            room_state: room.toString()
          });
        });
      }
    });
  };
}

export default RoomController;
