import ExampleRepository from '../Repositories/ExampleRepository';

class ExampleService {
  static exampleService = null;

  constructor() {
    this.exampleRepository = ExampleRepository.getRepository();
  }

  getRepository() {
    return this.exampleRepository;
  }

  static getExampleService() {
    if (!ExampleService.exampleService) {
      ExampleService.exampleService = new ExampleService();
    }

    return ExampleService.exampleService;
  }
}

export default ExampleService;
