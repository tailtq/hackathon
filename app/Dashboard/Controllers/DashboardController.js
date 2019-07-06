const translate = require('@k3rn31p4nic/google-translate-api');
import solve from '../../../infrastructure/Helpers/Wolframalpha'
class DashboardController {
   index(req, res) {
    return res.render('app/client/dashboard/index');
  }
}

export default DashboardController;