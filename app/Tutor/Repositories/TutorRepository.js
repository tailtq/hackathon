import UserRepository from '../../../infrastructure/Repositories/UserRepository';
import knex from '../../../config/database';

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

  getOnlineTutorsWithMajors(majorIds, limit) {
    return this.cloneQuery().where(knex.raw(`"majorIds" @> ARRAY[${majorIds.join(',')}]`))
      .where({ status: 1 }).whereNull('deletedAt').limit(limit);
  }
}

export default TutorRepository;
