import express from 'express';
import * as authService from '../services/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Todaily' });
});

router.post('/signup', authService.signup);

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Todaily' });
});

router.post('/login', authService.login);

router.get('/login_error', function(req, res, next) {
  res.render('login_error', { title: 'Todaily' });
});

router.post('/login_error', authService.login);

export default router;