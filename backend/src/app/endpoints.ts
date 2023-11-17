import { Request } from 'express';
import express from 'express';
import morgan from 'morgan';
import {
  LoginRequest,
  NewUserRequest,
  loginUser,
  loginWithToken,
  registerUser,
} from './user';
import { Pool } from 'pg';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const USER_SESSION_AGE = 1000 * 60 * 60 * 24; // 1 day

let pool: Pool;
const app = express();
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.post('/user', async (req: Request<{}, {}, NewUserRequest>, res) => {
  try {
    let user = await registerUser(pool, req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(409).json({ error: e.message });
  }
});

app.post('/user/login', async (req: Request<{}, {}, LoginRequest>, res) => {
  try {
    let [user, token] = await loginUser(pool, req.body);
    res
      .cookie('sessionToken', token, {
        maxAge: USER_SESSION_AGE,
        httpOnly: true,
      })
      .status(200)
      .json(user);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/user/login/token', async (req, res) => {
  try {
    let token = req.cookies['sessionToken'];
    let user = await loginWithToken(pool, token);
    res.status(200).json(user);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

export function serverStart(_pool: Pool, port: number) {
  pool = _pool;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
