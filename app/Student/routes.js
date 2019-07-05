import express from 'express';
import StudentController from './Controllers/StudentController';
import StudentRequests from './Requests/StudentRequests';

const router = express.Router();
const studentController = new StudentController();
const studentRequests = new StudentRequests();

router.get('/sign-in', studentController.callMethod('showSignInForm'));

router.post(
  '/sign-in',
  studentRequests.signInRequest(),
  studentController.callMethod('signIn')
);

router.get('/sign-up', studentController.callMethod('showSignUpForm'));

router.post(
  '/sign-up',
  studentRequests.signUpRequest(),
  studentController.callMethod('signUp')
);

export default router;
