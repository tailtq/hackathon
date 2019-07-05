import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class StudentRepository extends BaseRepository {
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

  async verifyEmailSlug(email, userId) {
    const queryFunction = (query) => {
      query = query.where((subQuery) => {
        subQuery.where('email', email).orWhere('slug', getSlug(email));
      });
      if (userId) {
        query = query.whereNot('id', userId);
      }

      return query;
    };

    return this.checkExist(queryFunction);
  }
}

export default StudentRepository;
