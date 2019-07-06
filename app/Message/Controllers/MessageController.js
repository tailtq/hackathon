import axios from 'axios';
import fs from 'fs';
import path from 'path';
import translate from '@k3rn31p4nic/google-translate-api';
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
    let botMessage;
    let userMessage = {
      userId: cUser.id,
      name: cUser.name,
      isBot: false,
      content,
      createdAt: new Date()
    };
    const processes = [
      Message.create(userMessage),
    ];

    if (content.trim().toLowerCase().indexOf('giải bài toán') >= 0) {
      processes.push(this.searchAlgebraQuestion(content, cUser));
    } else if (content.trim().toLowerCase().indexOf('cân bằng phương trình') >= 0) {
      processes.push(this.searchAlgebraQuestion(content, cUser));
    } else if (content.trim().toLowerCase().indexOf('nguyên tố hoá học') >= 0) {
      processes.push(this.searchChemicalElement(content, cUser));
    } else {
      processes.push(this.getBotMessage(cUser, 'Tôi không thể hiểu message này', null));
    }

    [userMessage, botMessage] = await Promise.all(processes);

    return this.success(res, {
      user: userMessage,
      bot: botMessage || {}
    });
  }

  async searchAlgebraQuestion(text, cUser) {
    const res = await axios.get(`https://coccoc.com/composer/math?q=${encodeURI(text)}`);
    const { data } = res;
    const imageUrl = data.math.variants[0].answers[0].answer_url;

    return this.getBotMessage(cUser, `<img src="${imageUrl}"/>`, data);
  }

  async searchChemicalElement(text, cUser) {
    let elements = fs.readFileSync(path.join(__dirname, '/../../../public/data/periodicTable.json'), 'utf8');
    elements = JSON.parse(elements).elements;
    let search = text.substr('nguyên tố hoá học '.length).trim().toLowerCase();
    let content;

    let searchedElement = elements.find((element) => {
      return element.symbol.toLowerCase() === search || element.name.toLowerCase() === search;
    });

    if (!searchedElement) {
      const translation = await translate(search, { from: 'vi', to: 'en' });
      search = translation.text.toLowerCase();
      searchedElement = elements.find((element) => {
        return element.name.toLowerCase() === search;
      });
    }
    if (searchedElement) {
      const { name, atomic_mass: atomicMass, symbol } = searchedElement;
      const translation = await translate(name, { from: 'en', to: 'vi' });
      content = `${translation.text} có khối lượng nguyên tử là ${atomicMass} và công thức hoá học là ${symbol}`;
    } else {
      content = 'Tôi không thể tìm thấy nguyên tố này';
    }

    return this.getBotMessage(cUser, content, null);
  }

  getBotMessage(cUser, content, dataContent) {
    const botMessage = {
      userId: cUser.id,
      name: 'Bot',
      isBot: true,
      content,
      dataContent,
      createdAt: new Date()
    };

    return Message.create(botMessage);
  }
}

export default MessageController;
