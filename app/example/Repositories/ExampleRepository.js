import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class ExampleRepository extends BaseRepository {
  static repository;

  static getRepository() {
    if (!ExampleRepository.repository) {
      ExampleRepository.repository = new ExampleRepository();
    }

    return ExampleRepository.repository;
  }

  setModel() {
    return Example;
  }
}

export default ExampleRepository;
