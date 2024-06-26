import { Request } from 'express';
import express from 'express';
import {
  LoginRequest,
  NewUserRequest,
  checkIfTokenLoggedIn,
  loginUser,
  loginWithToken,
  logoutUser,
  registerUser,
} from './user';
import { Pool } from 'pg';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { deleteUser, exportUsers, getAllUsers, importUsers } from './admin';
import { getAd, incrementAdCounter, updateAd } from './ad';
import {
  createRideType,
  deleteRideEntry,
  deleteRideType,
  exportUserRidesIntoCsv,
  getRideTypesOfUser,
  getUserRides,
  importUserRidesFromCsv,
  saveRideEntry,
} from './ride';
import morgan from 'morgan';

const USER_SESSION_AGE = 1000 * 60 * 60 * 24; // 1 day

let pool: Pool;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.static('dist'));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

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
    let userRideTypes = await getRideTypesOfUser(pool, user);
    user['rideTypes'] = userRideTypes;
    let userRides = await getUserRides(pool, user);
    user['rides'] = userRides;

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

app.post('/user/logout', async (req, res) => {
  try {
    await checkIfLoggedIn(pool, req.cookies['sessionToken']);
    await logoutUser(pool, req.cookies['sessionToken']);
    res.clearCookie('sessionToken').status(204).end();
  } catch (e) {
    if (e.message === 'Unauthorized') {
      res.status(401).json({ error: e.message });
      return;
    }
    res.status(500).end();
  }
});

app.get('/user/login/token', async (req, res) => {
  try {
    let token = req.cookies['sessionToken'];
    let user = await loginWithToken(pool, token);
    let userRideTypes = await getRideTypesOfUser(pool, user);
    user['rideTypes'] = userRideTypes;
    let userRides = await getUserRides(pool, user);
    user['rides'] = userRides;
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

app.post('/user/ridetype', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    let rideType = await createRideType(pool, req.body, user);
    res.status(201).json(rideType);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.delete('/user/ridetype/:id', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    await deleteRideType(pool, req.params.id, user);
    res.status(204).end();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.post('/user/ride', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    let ride = await saveRideEntry(pool, req.body, user);
    res.status(201).json(ride);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.delete('/user/ride/:id', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    await deleteRideEntry(pool, req.params.id, req.body.entryType, user);
    res.status(204).end();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/user/ride/export', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    let ridesCsv = await exportUserRidesIntoCsv(pool, user);
    res.status(200).send(ridesCsv);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.post('/user/ride/import', async (req, res) => {
  try {
    let user = await loginWithToken(pool, req.cookies['sessionToken']);
    await importUserRidesFromCsv(pool, user, req.body.csv);
    let userRides = await getUserRides(pool, user);
    res.status(200).json(userRides);
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

app.post('/admin/user/import', async (req, res) => {
  try {
    await checkIfAdmin(pool, req.cookies['sessionToken']);
    await importUsers(pool, req.body.csv);
    res.status(204).end();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/ad', async (_req, res) => {
  try {
    let ad = await getAd(pool);
    res.status(200).json(ad);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/admin/ad', async (req, res) => {
  try {
    await checkIfAdmin(pool, req.cookies['sessionToken']);
    let ad = await updateAd(pool, req.body);
    res.status(200).json(ad);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.put('/ad/:id', async (req, res) => {
  try {
    await incrementAdCounter(pool, req.params.id);
  } catch (e) {
    res.status(500).end();
  }
});

app.get('*', function (_req, res) {
  res.sendFile('index.html', { root: 'dist' });
});

async function checkIfAdmin(pool: Pool, token: string) {
  let user = await loginWithToken(pool, token);
  if (user.name !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}

async function checkIfLoggedIn(pool: Pool, token: string) {
  let loggedIn = await checkIfTokenLoggedIn(pool, token);
  if (!loggedIn) {
    throw new Error('Unauthorized');
  }
}

export function serverStart(_pool: Pool, port: number) {
  pool = _pool;
  let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  return server;
}
