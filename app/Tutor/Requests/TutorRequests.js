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
      this.getProfessionRule(),
      this.getDescriptionRule(),
      this.getMajorRule(),
      this.validate,
    ];
  }

  getMajorRule() {
    return check('majors').trim().not().isEmpty().isString();
  }

  getDescriptionRule() {
    return check('description').trim().isString().not().isEmpty().isLength({ min: 1, max: 255 });
  }

  getProfessionRule() {
    return check('profession').trim().isString().not().isEmpty().isLength({ min: 1, max: 100 });
  }
}

export default TutorRequests;
