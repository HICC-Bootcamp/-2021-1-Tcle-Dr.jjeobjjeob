import jwt from 'jsonwebtoken';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';
import { isJwtExpired } from 'jwt-check-expiration';

const authError = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken || isJwtExpired(accessToken)) {  // 검증할 수 없는 상태
    return res.status(401).json(authError);
  }

  jwt.verify(
    accessToken,
    config.jwt.secretKey,
    async (error, decoded) => {
      if (error) {
        return res.status(401).json(authError);
      }

      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json(authError);
      }
      
      // 토큰이 있으면 userid 정보를 추가
      req.userId = user.id;
      next();
    }
  );
};