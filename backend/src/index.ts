import dotenv from 'dotenv';
import { startServer } from './app/main';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'test') {
  // don't load any env file
} else {
  dotenv.config({ path: '.env.development' });
}

startServer(parseInt(process.env.APP_PORT));
