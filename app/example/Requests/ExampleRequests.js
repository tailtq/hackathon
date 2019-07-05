import BaseRequest from '../../../infrastructure/Requests/BaseRequest';

class ExampleRequests extends BaseRequest {
  static rules() {
    return [
      this.validate,
    ];
  }
}

export default ExampleRequests;
