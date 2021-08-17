import express from 'express';
import * as postService from '../services/posts.js';
import { isAuth } from '../services/tokenValidate.js';

const router = express.Router();

router.get('/', isAuth, function(req, res, next) {
  res.render('write');
});

router.post('/', isAuth, postService.write);

export default router;