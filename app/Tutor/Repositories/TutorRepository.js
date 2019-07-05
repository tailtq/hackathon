import UserRepository from '../../../infrastructure/Repositories/UserRepository';

class TutorRepository extends UserRepository {
  static repository;

  static getRepository() {
    if (!TutorRepository.repository) {
      TutorRepository.repository = new TutorRepository();
    }

    return TutorRepository.repository;
  }

  getTableName() {
    return 'tutors';
  }
}

export default TutorRepository;
