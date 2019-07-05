import bcrypt from 'bcryptjs';
import StudentRepository from '../Repositories/StudentRepository';
import UserController from '../../../infrastructure/Controllers/UserController';

class StudentController extends UserController {
  type = 'students';

  constructor() {
    super();
    this.repository = StudentRepository.getRepository();
  }

  showSignInForm(req, res) {
    return super.showSignInForm(req, res, this.type);
  }

  async signIn(req, res) {
    return super.signIn(req, res, this.type)
  }
}

export default StudentController;
