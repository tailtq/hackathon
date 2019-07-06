import express from 'express';

// import BaseAuthorize from '../infrastructure/Middleware/BaseAuthorize';
import dashboardRoutes from '../app/Dashboard/routes';
import studentRoutes from '../app/Student/routes';
import tutorRoutes from '../app/Tutor/routes';
import messageRoutes from '../app/Message/routes';
import handleException from '../infrastructure/Middleware/handleException';
import { verifyNotAuthentication } from '../infrastructure/Middleware/verifyAuthentication';

const router = express.Router();

router.use('/students', studentRoutes);

router.use('/tutors', tutorRoutes);

router.use(verifyNotAuthentication);

router.use('/messages', messageRoutes);

router.use('/', dashboardRoutes);

router.use(handleException);

export default router;
