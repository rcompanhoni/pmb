import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './authMiddleware';
import { supabase } from '../config/supabaseClient';

jest.mock('../config/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('authMiddleware', () => {
  // Partial used to simplify mocks
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(), // allows chaining as in res.status(401).json({ error: '...' })
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if the authorization header is missing', async () => {
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid or expired', async () => {
    req.headers!.authorization = 'Bearer invalidtoken';

    // mock Supabase response for invalid token
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid token' },
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should add userId and jwtToken to the request body and call next if token is valid', async () => {
    const validUser = { id: 'user-id' };
    req.headers!.authorization = 'Bearer validtoken';

    // mock a valid response from Supabase
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: validUser },
      error: null,
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(req.body.userId).toBe(validUser.id);
    expect(req.body.jwtToken).toBe('validtoken');
    expect(next).toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    req.headers!.authorization = 'Bearer validtoken';

    // avoid error messages in the terminal to unclutter test results
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // mock an error from Supabase
    (supabase.auth.getUser as jest.Mock).mockRejectedValue(
      new Error('Unexpected error'),
    );

    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });
});
