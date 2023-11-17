import { Request } from 'express';
import express from 'express';
import morgan from 'morgan';
import { LoginRequest, NewUserRequest, loginUser, registerUser } from './user';
import { Pool } from 'pg';

let pool: Pool;
const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.post(
  '/user/register',
  async (req: Request<{}, {}, NewUserRequest>, res) => {
    try {
      let user = await registerUser(pool, req.body);
      res.status(201).json(user);
    } catch (e) {
      res.status(409).json({ error: e.message });
    }
  },
);

app.post('/user/login', async (req: Request<{}, {}, LoginRequest>, res) => {
  try {
    let user = await loginUser(pool, req.body);
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
