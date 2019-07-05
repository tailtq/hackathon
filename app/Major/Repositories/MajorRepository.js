import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class MajorRepository extends BaseRepository {
  getTableName() {
    return 'majors';
  }

  static getRepository() {
    if (!MajorRepository.repository) {
      MajorRepository.repository = new MajorRepository();
    }

    return MajorRepository.repository;
  }
}

export default MajorRepository;
