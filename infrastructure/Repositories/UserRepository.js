import moment from 'moment';
import getSlug from 'speakingurl';
import bcrypt from 'bcryptjs';
import BaseRepository from './BaseRepository';
import { DEFAULT_AVATAR } from '../Constants/CommonConstants';

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

  async signUp(data, trx) {
    data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
    data.slug = getSlug(data.email);
    data.avatar = DEFAULT_AVATAR;

    return this.create(data, trx, ['id', 'email']);
  }

  assignBirthday(data) {
    if (data.birthday) {
      data.birthday = moment(data.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD');
    } else {
      delete data.birthday;
    }
  }

  updateWithoutTrans(clauses, attributes, returning = ['id']) {
    let query = this.cloneQuery();
    query = this.handleConditions(query, clauses, true);

    return query.update(attributes, returning);
  }
}

export default UserRepository;
