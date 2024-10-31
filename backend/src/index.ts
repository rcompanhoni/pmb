import express from 'express';
import { PORT } from './config/dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mainRouter from './routes';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
