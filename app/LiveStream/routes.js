import express from 'express';
import RoomController from './Controllers/RoomController';
import LiveStreamController from './Controllers/LiveStreamController';

const router = express.Router();
const liveStreamController = new LiveStreamController();
const roomController = new RoomController();

router.get('/livestream', liveStreamController.callMethod('index'));

router.post('/join/:roomId', liveStreamController.callMethod('join'));

router.post('/message/:roomId/:clientId', liveStreamController.callMethod('message'));

router.post('/leave/:roomId/:clientId', roomController.callMethod('leave'));

router.get('/r/:roomId', roomController.callMethod('index'));

export default router;

// { method: 'POST', path: '/leave/{roomId}/{clientId}', config: Room.leave },
// { method: 'POST', path: '/turn', config: Index.turn },
//
