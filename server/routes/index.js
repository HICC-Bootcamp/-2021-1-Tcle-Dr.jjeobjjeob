import express from 'express';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

/* GET home page. */
router.get('/', isAuth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;