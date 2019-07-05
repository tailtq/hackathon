import BaseAuthorize from '../../../infrastructure/Middleware/BaseAuthorize';

class ExampleAuthorize extends BaseAuthorize {
  defineRoutes() {
    this.routes = {
      listExamples: 'ListExamples',
    };
  }

  authorizeListExamples(req, res, next) {
    next();
  }
}

export default ExampleAuthorize;
