import BaseRepository from './BaseRepository';

class UserRepository extends BaseRepository {
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

export default UserRepository;
