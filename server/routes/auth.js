import express from 'express';
import * as authController from '../controller/auth.js';

const router = express.Router();
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Todaily' });
});

router.post('/signup', authController.signup);

export default router;