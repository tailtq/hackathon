import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class TutoringSessionRepository extends BaseRepository {
  static repository;

  static getRepository() {
    if (!TutoringSessionRepository.repository) {
      TutoringSessionRepository.repository = new TutoringSessionRepository();
    }

    return TutoringSessionRepository.repository;
  }

  getTableName() {
    return 'tutoring_sessions';
  }
}

export default TutoringSessionRepository;
