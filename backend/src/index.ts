import dotenv from 'dotenv';
import { startServer } from './app/main';
import morgan from 'morgan';

if (process.env.NODE_ENV === 'production') {
} else if (process.env.NODE_ENV === 'test') {
  //
} else {
  dotenv.config({ path: '.env.local' });
}

startServer(parseInt(process.env.APP_PORT), [morgan('tiny')]);
