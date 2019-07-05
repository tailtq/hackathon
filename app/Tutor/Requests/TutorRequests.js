import TutorRepository from '../Repositories/TutorRepository';
import UserRequests from '../../../infrastructure/Requests/UserRequests';
import { check } from 'express-validator/check';

class TutorRequests extends UserRequests {
  constructor() {
    super();
    this.repository = TutorRepository.getRepository();
  }

  signUpRequest() {
    return [
      this.getNameRule(),
      this.getEmailExistRule(false),
      this.getPhoneExistRule(false),
      this.getPasswordRule(),
      this.getPasswordConfirmationRule(),
      this.getAddressRule(),
      this.getMajorRule(),
      this.validate,
    ];
  }

  getMajorRule() {
    return check('majors').trim().not().isEmpty().isString();
  }
}

export default TutorRequests;
