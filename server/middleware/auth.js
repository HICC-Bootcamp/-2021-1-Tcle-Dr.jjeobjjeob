import jwt from 'jsonwebtoken';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';

const authError = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {  // 검증할 수 없는 상태
    return res.status(401).json(authError);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
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