import express from 'express';
import TutorController from './Controllers/TutorController';
import TutorRequests from './Requests/TutorRequests';

const router = express.Router();
const tutorController = new TutorController();
const tutorRequests = new TutorRequests();

router.get(
  '/sign-in',
  tutorController.callMethod('showSignInForm')
);

router.post(
  '/sign-in',
  tutorRequests.signInRequest(),
  tutorController.callMethod('signIn')
);

export default router;
