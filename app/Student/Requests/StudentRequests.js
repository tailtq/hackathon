import { check } from 'express-validator/check';
import moment from 'moment';
import bcrypt from 'bcryptjs';

import StudentRepository from '../Repositories/StudentRepository';
import BaseRequest from '../../../infrastructure/Requests/BaseRequest';
import BadRequestException from '../../../infrastructure/Exceptions/BadRequestException';

class StudentRequests extends BaseRequest {
  constructor() {
    super();
    this.studentRepository = StudentRepository.getRepository();
  }

  verifyUserImageInfo(image, allowEmpty) {
    if (!image && !allowEmpty) {
      return Promise.reject(new BadRequestException('Image is required'));
    } else if (!image) {
      return Promise.resolve();
    }

    const result = this.verifyImage(image[0]);
    if (!result.status) {
      return Promise.reject(new BadRequestException(result.message));
    }

    return Promise.resolve();
  }

  signUpRequest() {
    return [
      this.getNameRule(),
      this.getEmailExistRule(false),
      this.getPhoneExistRule(false),
      this.getPasswordRule(),
      this.getPasswordConfirmationRule(),
      this.getAddressRule(),
      // this.getPassportImageRule(),
      // this.getResidenceImageRule(),
      this.validate,
    ];
  }

  signInRequest() {
    return [
      check('email').trim().not().isEmpty().isEmail().isLength({ min: 1, max: 90 }),
      this.getPasswordRule(),
      this.validate,
    ];
  }

  editProfileRequest() {
    return [
      this.getNameRule(),
      this.getEmailExistRule('currentUser'),
      this.getPhoneExistRule('currentUser'),
      this.getAddressRule(),
      this.getBirthdayRule('MM/DD/YYYY'),
      check('gender').optional().isIn(['0', '1', '2']),
      this.validate,
    ];
  }

  forgotPasswordRequest() {
    return [
      check('email').trim()
        .isEmail().not().isEmpty()
        .isLength({ min: 1, max: 90 })
        .custom(async (email) => {
          if (await this.studentRepository.checkExist({ email })) {
            return Promise.resolve();
          }
          return Promise.reject();
        }),
      this.validate,
    ];
  }

  resetPasswordRequest() {
    return [
      this.getPasswordRule(),
      this.getPasswordConfirmationRule(),
      this.validate,
    ];
  }

  changePasswordRequest() {
    return [
      this.getOldPasswordRule(),
      this.getPasswordRule(),
      this.getPasswordConfirmationRule(),
      this.validate,
    ];
  }

  changeAvatarRequest() {
    return [
      check('avatar')
        .custom((value, { req }) => this.verifyUserImageInfo(req.files.avatar)),
      this.validate,
    ];
  }

  getPhoneExistRule(withUser) {
    return check('phone').trim()
      .isString().not().isEmpty()
      .isLength({ min: 1, max: 20 });
  }

  getEmailExistRule(withUser) {
    return check('email').trim()
      .not().isEmpty()
      .isEmail()
      .isLength({ min: 1, max: 90 })
      .custom(async (email, { req }) => {
        let userId = null;
        if (withUser === 'param') {
          userId = req.params.id;
        } else if (withUser === 'currentUser') {
          userId = req.session.cUser.id;
        }
        if (await this.studentRepository.verifyEmailSlug(email, userId)) {
          return Promise.reject();
        }
        return Promise.resolve();
      });
  }

  getNameRule() {
    return check('name').trim()
      .isString().not().isEmpty()
      .isLength({ min: 1, max: 120 });
  }

  getBirthdayRule(format) {
    return check('birthday').trim().optional({ checkFalsy: true })
      .custom((value) => {
        const isValid = moment(value, format, true).isValid();

        return isValid && !moment(value, format).isAfter(moment().add(-18, 'year')) && !moment(value, format).isBefore(moment().add(-80, 'year'));
      });
  }

  getPasswordRule(isRequired = true, field = 'password') {
    let rule = check(field).isString();

    if (isRequired) {
      rule = rule.not().isEmpty();
    } else {
      rule = rule.optional({ checkFalsy: true });
    }

    return rule.isLength({ min: 6, max: 15 });
  }

  getOldPasswordRule() {
    return this.getPasswordRule(true, 'currentPassword').custom(async (value, { req }) => {
      const { id } = req.session.cUser;
      const { password } = await this.studentRepository.getById(id, ['password']);

      return bcrypt.compareSync(value, password);
    });
  }

  getPasswordConfirmationRule() {
    return check('passwordConfirmation')
      .custom((value, { req }) => {
        if (req.body.password && !value) {
          return Promise.reject(new BadRequestException());
        } else if (value !== req.body.password) {
          return Promise.reject(new BadRequestException());
        }
        return true;
      });
  }

  getAddressRule() {
    return check('address').trim().not().isEmpty()
      .isString()
      .isLength({ min: 1, max: 255 });
  }
}

export default StudentRequests;
