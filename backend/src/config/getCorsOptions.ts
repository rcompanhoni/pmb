import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-production-c823.up.railway.app',
];

export const getCorsOptions = (): CorsOptions => ({
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `CORS policy violation: The origin ${origin} is not allowed access to this resource.`,
        ),
      );
    }
  },
  credentials: true, // allows cookies to be included, if necessary
  optionsSuccessStatus: 200, // ensures browsers receive a success status for preflight requests
});
