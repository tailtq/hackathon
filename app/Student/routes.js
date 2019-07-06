import express from 'express';
import StudentController from './Controllers/StudentController';
import StudentRequests from './Requests/StudentRequests';
import { verifyAuthentication } from '../../infrastructure/Middleware/verifyAuthentication';

const router = express.Router();
const studentController = new StudentController();
const studentRequests = new StudentRequests();

router.get('/sign-in', verifyAuthentication, studentController.callMethod('showSignInForm'));

router.post(
  '/sign-in',
  verifyAuthentication,
  studentRequests.signInRequest(),
  studentController.callMethod('signIn')
);

router.get('/sign-up', verifyAuthentication, studentController.callMethod('showSignUpForm'));

router.post(
  '/sign-up',
  verifyAuthentication,
  studentRequests.signUpRequest(),
  studentController.callMethod('signUp')
);

router.get('/sign-out', studentController.callMethod('signOut'));

export default router;
