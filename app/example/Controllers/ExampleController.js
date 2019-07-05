import BaseController from '../../../infrastructure/Controllers/BaseController';
import ExampleService from '../Services/ExampleService';

class ExampleController extends BaseController {
  constructor() {
    super();
    this.exampleService = ExampleService.getService();
  }

  list(req, res) {
    return res.render('app/client/User/index');
  }
}

export default ExampleController;
