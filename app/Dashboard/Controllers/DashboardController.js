const translate = require('@k3rn31p4nic/google-translate-api');
import solve from '../../../infrastructure/Helpers/Wolframalpha'
class DashboardController {
  async index(req, res) {
    let question = 'Hằng số PI là bao nhiêu?'

      question = await translate(question, {from:'vi', to:'en'});
      
      const result = await solve(question.text)
      // console.log(result);
      
      const answer = await translate(result, {from:'en', to:'vi'});
      console.log(answer.text);
      
      return res.render('app/client/dashboard/index');
  }
}

export default DashboardController;