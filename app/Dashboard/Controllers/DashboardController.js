import axios from 'axios'
import { header } from 'express-validator/check';

class DashboardController {
  index(req, res) {
    return res.render('app/client/dashboard/index');
  }
}

export default DashboardController;
