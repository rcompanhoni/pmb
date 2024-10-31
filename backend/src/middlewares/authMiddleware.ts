import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader && authHeader.split(' ')[1];

    // missing bearer JWT token in the request header
    if (!jwtToken) {
      res.status(401).json({ error: 'Access token is missing' });
      return;
    }

    // validate the JWT token and get user info from it
    const { data: userInfo, error } = await supabase.auth.getUser(jwtToken);
    if (error || !userInfo || !userInfo.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // add the userId and token to the request body
    req.body.userId = userInfo.user.id;
    req.body.jwtToken = jwtToken;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
