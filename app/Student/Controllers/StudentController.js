import StudentRepository from '../Repositories/StudentRepository';
import UserController from '../../../infrastructure/Controllers/UserController';

class StudentController extends UserController {
  type = 'students';

  constructor() {
    super();
    this.repository = StudentRepository.getRepository();
  }
}

export default StudentController;
