import express from 'express';
import MessageController from './Controllers/MessageController';

const router = express.Router();
const messageController = new MessageController();

router.get('/', messageController.callMethod('loadMessages'));

router.post('/', messageController.callMethod('sendMessage'));

export default router;
