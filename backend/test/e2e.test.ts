import assert from 'node:assert';
import axios from 'axios';
import { RideType, RideEntryType } from '../src/app/ride';
import { startServer } from '../src/app/main';

const BASE_URL = `http://localhost:${process.env.APP_PORT}`;

describe('e2e test', () => {
  console.log('E2E test for app running on:', BASE_URL);
  let serverStop: () => Promise<void>;

  before(() => {
    serverStop = startServer(parseInt(process.env.APP_PORT!), []);
  });

  after(() => serverStop());

  it('register', async () => {
    let newUserReq = {
      email: 'test@test.sk',
      password: 'test',
      name: 'test',
      age: 25,
    };

    await axios.post(`${BASE_URL}/user`, newUserReq).then((res) => {
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.email, newUserReq.email);
      assert.strictEqual(res.data.name, newUserReq.name);
      assert.strictEqual(res.data.age, newUserReq.age);
    });
  });

  let sessionToken: string;
  let userId: string;
  it('login', async () => {
    let loginReq = {
      email: 'test@test.sk',
      password: 'test',
    };

    await axios.post(`${BASE_URL}/user/login`, loginReq).then((res) => {
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.email, loginReq.email);
      assert.strictEqual(res.data.name, 'test');
      assert.strictEqual(res.data.age, 25);
      assert.strictEqual(res.data.rideTypes.length, 0);
      assert.strictEqual(res.data.rides.length, 0);
      userId = res.data.id;
      sessionToken = res.headers['set-cookie']![0].split(';')[0].split('=')[1];
    });
  });

  let rideType: RideType;
  it('add ride type', async () => {
    let rideTypeReq = {
      name: 'test-ride-type',
      description: 'test-ride-type',
    };

    await axios
      .post(`${BASE_URL}/user/ridetype`, rideTypeReq, {
        headers: {
          cookie: `sessionToken=${sessionToken}`,
        },
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.data.name, rideTypeReq.name);
        assert.strictEqual(res.data.description, rideTypeReq.description);
        assert.strictEqual(res.data.userId, userId);
        rideType = res.data;
      });
  });

  let rideIds = new Array<string>();
  it('create ride - route', async () => {
    let rideReq = {
      date: new Date(),
      value: 1567, // 15.67 km
      typeId: rideType.id,
      rideEntryType: RideEntryType.ROUTE,
    };

    await axios
      .post(`${BASE_URL}/user/ride`, rideReq, {
        headers: {
          cookie: `sessionToken=${sessionToken}`,
        },
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        assert.strictEqual(
          new Date(res.data.date).toLocaleDateString(),
          rideReq.date.toLocaleDateString(),
        );
        assert.strictEqual(res.data.value, rideReq.value);
        assert.strictEqual(res.data.typeId, rideReq.typeId);
        assert.strictEqual(res.data.rideEntryType, rideReq.rideEntryType);
        rideIds.push(res.data.id);
      });
  });

  it('create ride - consumption', async () => {
    let rideReq = {
      date: new Date(),
      value: 960, // 9.6 l/100km
      typeId: null,
      rideEntryType: RideEntryType.CONSUMPTION,
    };

    await axios
      .post(`${BASE_URL}/user/ride`, rideReq, {
        headers: {
          cookie: `sessionToken=${sessionToken}`,
        },
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        assert.strictEqual(
          new Date(res.data.date).toLocaleDateString(),
          rideReq.date.toLocaleDateString(),
        );
        assert.strictEqual(res.data.value, rideReq.value);
        assert.strictEqual(res.data.typeId, rideReq.typeId);
        assert.strictEqual(res.data.rideEntryType, rideReq.rideEntryType);
        rideIds.push(res.data.id);
      });
  });

  it('create ride - duration', async () => {
    let rideReq = {
      date: new Date(),
      value: 5450, // 54 min 30 sec
      typeId: rideType.id,
      rideEntryType: RideEntryType.DURATION,
    };

    await axios
      .post(`${BASE_URL}/user/ride`, rideReq, {
        headers: {
          cookie: `sessionToken=${sessionToken}`,
        },
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        assert.strictEqual(
          new Date(res.data.date).toLocaleDateString(),
          rideReq.date.toLocaleDateString(),
        );
        assert.strictEqual(res.data.value, rideReq.value);
        assert.strictEqual(res.data.typeId, rideReq.typeId);
        assert.strictEqual(res.data.rideEntryType, rideReq.rideEntryType);
        rideIds.push(res.data.id);
      });
  });

  it('get user with rides', async () => {
    await axios
      .get(`${BASE_URL}/user/login/token`, {
        headers: {
          cookie: `sessionToken=${sessionToken}`,
        },
      })
      .then((res) => {
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data.email, 'test@test.sk');
        assert.strictEqual(res.data.name, 'test');
        assert.strictEqual(res.data.age, 25);
        assert.strictEqual(res.data.rideTypes.length, 1);
        assert.strictEqual(res.data.rideTypes[0].id, rideType.id);
        assert.strictEqual(res.data.rides.length, 3);
        assert.ok(rideIds.includes(res.data.rides[0].id));
        assert.ok(rideIds.includes(res.data.rides[1].id));
        assert.ok(rideIds.includes(res.data.rides[2].id));
      });
  });
});
