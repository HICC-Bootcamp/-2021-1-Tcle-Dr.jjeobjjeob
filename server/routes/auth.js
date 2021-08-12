import express from 'express';
import * as authService from '../services/auth.js';

const router = express.Router();
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Todaily' });
});

router.post('/signup', authService.signup);

export default router;