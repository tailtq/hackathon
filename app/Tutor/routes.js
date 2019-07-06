import express from 'express';
import TutorController from './Controllers/TutorController';
import TutorRequests from './Requests/TutorRequests';
import { verifyAuthentication, verifyNotAuthentication } from '../../infrastructure/Middleware/verifyAuthentication';
import { decodeParams } from '../../infrastructure/Middleware/decodeMiddleware';

const router = express.Router();
const tutorController = new TutorController();
const tutorRequests = new TutorRequests();

router.param('id', decodeParams);

router.get(
  '/sign-in',
  verifyAuthentication,
  tutorController.callMethod('showSignInForm')
);

router.post(
  '/sign-in',
  verifyAuthentication,
  tutorRequests.signInRequest(),
  tutorController.callMethod('signIn')
);

router.get('/sign-up', verifyAuthentication, tutorController.callMethod('showSignUpForm'));

router.post(
  '/sign-up',
  verifyAuthentication,
  tutorRequests.signUpRequest(),
  tutorController.callMethod('signUp')
);

router.get('/sign-out', tutorController.callMethod('signOut'));

router.use(verifyNotAuthentication);

router.get('/online', tutorController.callMethod('contactOnlineTutors'));

router.get('/:id/contact', tutorController.callMethod('contactDetail'));

export default router;
