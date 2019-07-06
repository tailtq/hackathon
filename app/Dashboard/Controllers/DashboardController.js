import axios from 'axios'
import { header } from 'express-validator/check';

class DashboardController {
  async index(req, res) {
    console.log("aa");
    let sentence = "Khoảng cách từ trái đất đến mặt trời là"
    sentence = "Giải toán"
    let result = await axios.get(
      'https://api.wit.ai/message?v=20160526&q=' + encodeURI(sentence)
    , {headers: {Authorization: 'Bearer PH6PVYFR34LD2CI6NPAOWRU56EW5AHWH'}})

    result = result.data
    // console.log(Object.values(result.entities)[0]);
    // console.log();
    // const agents = result.entities.agents
   
    // agents.sort((a,b) => (a.confidence < b.confidence) ? 1 : ((b.confidence > a.confidence) ? -1 : 0)); 
    // const resValue = agents[0].value
    console.log(result.entities);

    
    return res.render('app/client/dashboard/index');
  }
}

export default DashboardController;
