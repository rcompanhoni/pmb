import express from 'express';
import cors from 'cors';
import { PORT } from './config/dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mainRouter from './routes';
import { getCorsOptions } from './config/getCorsOptions';

const app = express();

app.use(cors(getCorsOptions()));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
