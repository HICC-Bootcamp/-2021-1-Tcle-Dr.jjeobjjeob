import express from 'express';
import multer from 'multer';
import path from 'path';
import * as postService from '../services/posts.js';
import { isAuth } from '../services/tokenValidate.js';

const router = express.Router();

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("jpg, jpeg, png, gif 확장자 파일만 업로드할 수 있습니다."));
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/posts/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, Date.now() + "_" + basename + ext);
  },
});

const upload = multer({storage: storage, fileFilter:imageFilter});


router.get('/write', isAuth, function(req, res, next) {
  res.render('write');
});

router.post('/write', isAuth, upload.single('image'), postService.write);

router.get('/', isAuth, postService.read);

export default router;