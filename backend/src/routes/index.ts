import express from 'express';
import userRoutes from './userRoutes';
import profileRoutes from './profileRoutes';
import jobRoutes from './jobRoutes';
import companyRoutes from './companyRoutes';
import userJobRoutes from './userJobRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', jobRoutes);
router.use('/companies', companyRoutes);
router.use('/user-jobs', userJobRoutes);

export default router; 