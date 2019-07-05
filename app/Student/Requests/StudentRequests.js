import StudentRepository from '../Repositories/StudentRepository';
import UserRequests from '../../../infrastructure/Requests/UserRequests';

class StudentRequests extends UserRequests {
  constructor() {
    super();
    this.repository = StudentRepository.getRepository();
  }
}

export default StudentRequests;
