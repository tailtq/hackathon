import express from 'express';

// import BaseAuthorize from '../infrastructure/Middleware/BaseAuthorize';
import dashboardRoutes from '../app/Dashboard/routes';
import studentRoutes from '../app/Student/routes';
import handleException from '../infrastructure/Middleware/handleException';

const router = express.Router();

router.use('/dashboard', dashboardRoutes);

router.use('/students', studentRoutes);

router.use(handleException);

export default router;
