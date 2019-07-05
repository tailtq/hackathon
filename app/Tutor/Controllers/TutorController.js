import bcrypt from 'bcryptjs';
import TutorRepository from '../Repositories/TutorRepository';
import UserController from '../../../infrastructure/Controllers/UserController';

class TutorController extends UserController {
  type = 'tutors';

  constructor() {
    super();
    this.repository = TutorRepository.getRepository();
  }
}

export default TutorController;
