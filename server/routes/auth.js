import express from 'express';
import * as authService from '../services/auth.js';

const router = express.Router();

router.get('/signup', function(req, res, next) {
  res.render('signup', { errorMsg : '' });
});

router.post('/signup', authService.signup);

router.get('/login', function(req, res, next) {
  res.render('login', { errorMsg : '' });
});

router.post('/login', authService.login);

export default router;