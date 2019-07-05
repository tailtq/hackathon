import UserRepository from '../../../infrastructure/Repositories/UserRepository';

class StudentRepository extends UserRepository {
  static repository;

  static getRepository() {
    if (!StudentRepository.repository) {
      StudentRepository.repository = new StudentRepository();
    }

    return StudentRepository.repository;
  }

  getTableName() {
    return 'students';
  }
}

export default StudentRepository;
