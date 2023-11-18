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
import { deleteUser, exportUsers, getAllUsers } from './admin';

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

app.get('/user', async (req, res) => {
  let token = req.cookies['sessionToken'];
  try {
    await checkIfAdmin(pool, token);
    let users = await getAllUsers(pool);
    res.status(200).json(users);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.post('/admin/user', async (req: Request<{}, {}, NewUserRequest>, res) => {
  try {
    await checkIfAdmin(pool, req.cookies['sessionToken']);
    let user = await registerUser(pool, req.body);
    res.status(201).json(user);
  } catch (e) {
    if (e.message === 'Unauthorized') {
      res.status(401).json({ error: e.message });
    } else {
      res.status(409).json({ error: e.message });
    }
  }
});

app.delete('/admin/user/:id', async (req, res) => {
  try {
    await checkIfAdmin(pool, req.cookies['sessionToken']);
    await deleteUser(pool, req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/admin/user/export', async (req, res) => {
  try {
    await checkIfAdmin(pool, req.cookies['sessionToken']);
    let usersCsv = await exportUsers(pool);
    res.status(200).send(usersCsv);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

async function checkIfAdmin(pool: Pool, token: string) {
  let user = await loginWithToken(pool, token);
  if (user.name !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}

export function serverStart(_pool: Pool, port: number) {
  pool = _pool;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
