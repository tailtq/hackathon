import BaseController from '../../../infrastructure/Controllers/BaseController';
import Message from '../Models/Message';

class MessageController extends BaseController {
  constructor() {
    super();
  }

  async loadMessages(req, res) {
    const { cUser } = req.session;
    const result = await Message.find({ userId: cUser.id }, []);
    // Handle Wit.AI

    return this.success(res, result);
  }

  async sendMessage(req, res) {
    const { cUser } = req.session;
    const { content } = req.body;

    const data = {
      userId: cUser.id,
      name: cUser.name,
      isBot: false,
      content,
      createdAt: new Date()
    };
    const result = await Message.create(data);

    return this.success(res, result);
  }
}

export default MessageController;
