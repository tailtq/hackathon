import express from 'express';

// import BaseAuthorize from '../infrastructure/Middleware/BaseAuthorize';
import dashboardRoutes from '../app/Dashboard/routes';
import handleException from '../infrastructure/Middleware/handleException';

const router = express.Router();

router.use('/dashboard', dashboardRoutes);

router.use(handleException);

export default router;
