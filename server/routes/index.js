import express from 'express';
import { isAuth } from '../services/tokenValidate.js';

const router = express.Router();

/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
  res.redirect('/auth/login');
});

export default router;