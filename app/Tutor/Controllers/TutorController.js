import getSlug from 'speakingurl';
import TutorRepository from '../Repositories/TutorRepository';
import UserController from '../../../infrastructure/Controllers/UserController';
import MajorRepository from '../../Major/Repositories/MajorRepository';
import knex from '../../../config/database';
import NotFoundException from '../../../infrastructure/Exceptions/NotFoundException';
import TutoringSessionRepository from '../../TutoringSession/Repositories/TutoringSessionRepository';

class TutorController extends UserController {
  type = 'tutors';

  signUpFields = ['majors', 'email', 'password', 'name', 'phone', 'address', 'profession', 'description'];

  constructor() {
    super();
    this.repository = TutorRepository.getRepository();
    this.majorRepository = MajorRepository.getRepository();
    this.tutoringSessionRepository = TutoringSessionRepository.getRepository();
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

  async listAll(req, res) {
    let { majors } = req.query;
    let condition = {};

    if (majors) {
      majors = this.filterMajors(majors);
      condition = q => q.where(knex.raw(`"majorIds" @> ARRAY[${majors}]`));
    }
    let tutors = await this.repository.getAllBy(condition, ['id', 'name', 'avatar', 'description', 'majorIds', 'profession']);
    tutors = await this.listMajorsByTutors(tutors);

    return res.render('app/client/tutors/list-online', this.hashIds({ tutors }));
  }

  async listOnlineTutors(req, res) {
    let { majors } = req.query;
    let condition = { status: 1 };

    if (majors) {
      majors = this.filterMajors(majors);
      condition = q => q.where(knex.raw(`"majorIds" @> ARRAY[${majors}]`)).where({ status: 1 });
    }
    let tutors = await this.repository.getAllBy(condition, ['id', 'name', 'avatar', 'description', 'majorIds', 'profession']);
    tutors = await this.listMajorsByTutors(tutors);

    return res.render('app/client/tutors/list-online', this.hashIds({ tutors }));
  }

  filterMajors(majors) {
    return majors.split(',').filter(e => Number.isInteger(parseInt(e))).join(',');;
  }

  async listMajorsByTutors(tutors) {
    for (let i = 0; i < tutors.length; i++) {
      const tutor = tutors[i];
      tutor.majors = await this.majorRepository.getAllBy(q => q.whereIn('id', tutor.majorIds || []));
    }

    return tutors;
  }

  async viewProfile(req, res) {
    const { id } = req.params;
    const tutor = await this.repository.getById(id);

    if (!tutor) {
      throw new NotFoundException();
    }

    return res.render('app/client/tutors/detail', this.hashIds({ tutor }));
  }

  async contact(req, res) {
    const { id } = req.params;
    const tutor = await this.repository.getById(id, ['id']);

    if (!tutor) {
      throw new NotFoundException();
    }

    const room = this.pad(parseInt(Math.random() * 1000000000), 9);
    const data = {
      tutorId: tutor.id,
      studentId: req.session.cUser.id,
      startedAt: new Date(),
      room,
    };
    const session = await knex.transaction(trx => this.tutoringSessionRepository.create(data, trx, ['room']));

    return res.redirect(`/r/${session.room}`);
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}

export default TutorController;
