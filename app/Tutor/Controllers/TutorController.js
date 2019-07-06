import getSlug from 'speakingurl';
import TutorRepository from '../Repositories/TutorRepository';
import UserController from '../../../infrastructure/Controllers/UserController';
import MajorRepository from '../../Major/Repositories/MajorRepository';
import knex from '../../../config/database';

class TutorController extends UserController {
  type = 'tutors';

  signUpFields = ['majors', 'email', 'password', 'name', 'phone', 'address', 'description'];

  constructor() {
    super();
    this.repository = TutorRepository.getRepository();
    this.majorRepository = MajorRepository.getRepository();
  }

  async signUp(req, res) {
    const data = this.filterFields(req.body, this.signUpFields);
    const tutor = await knex.transaction(async (trx) => {
      data.majorIds = await this.getMajorIds(data.majors, trx);
      delete data.majors;

      return this.repository.signUp(data, trx)
    });
    this.setSession(req, tutor);

    return res.redirect('/');
  }

  async getMajorIds(data, trx) {
    const input = data.split(',');
    const majors = input.map(major => ({ name: major, slug: getSlug(major) }));
    const majorsSlug = majors.map(major => major.slug);

    const existingMajors = await this.majorRepository.getAllBy((q) => q.whereIn('slug', majorsSlug), ['id', 'slug']);
    const existSlugs = existingMajors.map(major => major.slug);
    let ids = existingMajors.map(major => major.id);

    const notExistMajors = majors.filter(major => existSlugs.indexOf(major.slug) === -1);

    if (notExistMajors.length) {
      await this.majorRepository.create(notExistMajors, trx);
      const notExistSlugs = notExistMajors.map(major => major.slug);
      const newMajors = await this.majorRepository.transactionListBy(trx, q => q.whereIn('slug', notExistSlugs), ['id']);
      const newIds = newMajors.map(major => major.id);
      ids = [...ids, ...newIds]
    }

    return ids;
  }

  async contactOnlineTutors(req, res) {
    let { majors } = req.query;
    let condition = { status: 1 };
    if (majors) {
      majors = majors.split(',').filter(e => Number.isInteger(parseInt(e))).join(',');
      condition = q => q.where(knex.raw(`"majorIds" @> ARRAY[${majors}]`)).where({ status: 1 });
    }
    const tutors = await this.repository.getAllBy(condition, ['id', 'name', 'avatar', 'description']);

    return res.render('app/client/tutors/list-online', this.hashIds({ tutors }));
  }

  contactDetail(req, res) {
    return res.render('app/client/tutors/contact');
  }
}

export default TutorController;
