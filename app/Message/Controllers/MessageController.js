import axios from 'axios';
import fs from 'fs';
import path from 'path';
import translate from '@k3rn31p4nic/google-translate-api';
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Message from '../Models/Message';
import balanceChemicalEquation from '../../../infrastructure/Helpers/ChemicalEquationBalancerHelper';
import solve from '../../../infrastructure/Helpers/Wolframalpha';
import search from '../../../infrastructure/Helpers/WikiHelper';
import MajorRepository from '../../Major/Repositories/MajorRepository';

class MessageController extends BaseController {
  constructor() {
    super();
    this.majorRepository = MajorRepository.getRepository();
  }

  async loadMessages(req, res) {
    const { cUser } = req.session;
    const result = await Message.find({ userId: cUser.id }, []);

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
    // Handle Wit.AI
    const condition = content.trim().toLowerCase();
    const testCase = await this.callWitAI(content);

    if (condition.indexOf('giải bài toán') >= 0 || testCase.keyword === 'solvemath' || testCase.keyword === 'coccoc') {
      processes.push(this.searchAlgebraQuestion(content, cUser));
      testCase.subject = 'math';
    } else if (condition.indexOf('cân bằng phương trình') >= 0 || testCase.keyword === 'chemicalbalance') {
      const text = content.substr('cân bằng phương trình: '.length).trim();

      processes.push(this.balanceChemicalEquation(text, cUser));
    } else if (condition.indexOf('tìm nguyên tố hoá học') >= 0 || testCase.keyword === 'chemicalelement') {
      const search = content.substr('tìm nguyên tố hoá học '.length).trim().toLowerCase();

      processes.push(this.searchChemicalElement(search, cUser));
    } else if (condition.indexOf('dịch giúp tôi') >= 0 || testCase.subject === 'english') {
      const text = content.substr('dịch giúp tôi: '.length).trim().toLowerCase();

      processes.push(this.translateText(text, cUser));
    } else {
      processes.push(this.handleRemainCases(content, cUser));
    }
    // TODO: Đổi đơn vị -> Đợi Wit.AI

    [userMessage, botMessage] = await Promise.all(processes);
    let additionalMessage = null;

    if (botMessage.content === 'Tôi không thể hiểu message này' && testCase.subject) {
      let majors = await this.majorRepository.getAllBy(q => q.where('slug', 'ilike', `%${testCase.subject}%`), ['id']);

      if (majors.length) {
        let idsString = '';
        majors.forEach((major) => {
          idsString += major.id;
        });
        additionalMessage = `Chúng tôi có thể tìm những giảng viên phù hợp với bạn theo <a href="/tutors/online?majors=${idsString}">link</a> này!`;
        additionalMessage = await this.getBotMessage(cUser, additionalMessage);
      } else {
        additionalMessage = `Bạn có thể tìm những giảng viên phù hợp theo <a href="/tutors/online">link</a> này!`;
        additionalMessage = await this.getBotMessage(cUser, additionalMessage);
      }
    }

    return this.success(res, {
      user: userMessage,
      bot: botMessage || {},
      additionalMessage,
    });
  }

  async callWitAI(query) {
    const result = await axios.get('https://api.wit.ai/message?v=20190707', {
      headers: { Authorization: 'Bearer N4D2I4RANVOY4HCKD5W4KMDME24REXPH' },
      params: { q: query }
    });
    let keyword;
    let subject;
    const { entities } = result.data;

    if (Object.keys(entities)[0] === 'english') {
      subject = 'english';
    } else if (entities.agents) {
      keyword = entities.agents[0].value;
    } else if (entities.intent) {
      keyword = entities.intent[0].value;
    } else {
      keyword = Object.keys(entities)[0];
    }

    return {
      keyword,
      subject: (['greeting', 'subjects'].indexOf(subject) >= 0) ? null : subject
    };
  }

  async searchAlgebraQuestion(text, cUser) {
    const res = await axios.get(`https://coccoc.com/composer/math?q=${encodeURI(text)}`);
    const { data } = res;
    let content;

    if (data.math.variants[0]) {
      const imageUrl = data.math.variants[0].answers[0].answer_url;
      content = `<img src="${imageUrl}"/>`;
    } else {
      content = 'Tôi không thể hiểu message này';
    }

    return this.getBotMessage(cUser, content, data);
  }

  async searchChemicalElement(search, cUser) {
    let elements = fs.readFileSync(path.join(__dirname, '/../../../public/data/periodicTable.json'), 'utf8');
    elements = JSON.parse(elements).elements;
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

    return this.getBotMessage(cUser, content);
  }

  async translateText(text, cUser) {
    const translation = await translate(text, { from: 'en', to: 'vi' });

    return this.getBotMessage(cUser, translation.text);
  }

  async balanceChemicalEquation(text, cUser) {
    const result = balanceChemicalEquation(text);
    let content;

    if (!result) {
      content = 'Phương trình không hợp lệ';
    } else if (result === true) {
      content = text;
    } else {
      content = result;
    }

    return this.getBotMessage(cUser, content);
  }

  async handleRemainCases(text, cUser) {
    let content;
    const dataContent = await search(text);
    if (dataContent) {
      return this.getBotMessage(cUser, dataContent.content, dataContent);
    }

    const question = await translate(text, { from: 'vi', to: 'en' });
    const result = await solve(question.text);

    if (result) {
      const answer = await translate(result, { from: 'en', to: 'vi' });
      content = answer.text;
    } else {
      content = 'Tôi không thể hiểu message này';
    }

    return this.getBotMessage(cUser, content);
  }

  getBotMessage(cUser, content, dataContent = null) {
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
