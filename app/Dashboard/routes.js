import express from 'express';
import DashboardController from './Controllers/DashboardController';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/', dashboardController.index);

export default router;
