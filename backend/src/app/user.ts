import { Pool } from 'pg';
import bcrypt from 'bcrypt';

export const SALT_ROUNDS = 10;

export class NewUserRequest {
  public email: string;
  public password: string;
  public name: string;
  public age: number;
}

export class LoginRequest {
  public email: string;
  public password: string;
}

export class User {
  public id: string;
  public email: string;
  public passwordHash: string;
  public name: string;
  public age: number;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    age: number,
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.age = age;
  }
}

export async function registerUser(
  pool: Pool,
  newUser: NewUserRequest,
): Promise<User> {
  try {
    let hash = await bcrypt.hash(newUser.password, SALT_ROUNDS);
    let result = await pool.query(
      'insert into user_account (id, email, passwordHash, name, age) values (gen_random_uuid(), $1, $2, $3, $4) returning *',
      [newUser.email, hash, newUser.name, newUser.age],
    );
    return new User(
      result.rows[0].id,
      result.rows[0].email,
      result.rows[0].passwordhash,
      result.rows[0].name,
      result.rows[0].age,
    );
  } catch (e) {
    if (e.code === '23505') {
      throw new Error('Email already in use');
    }
    throw e;
  }
}

export async function loginUser(
  pool: Pool,
  login: LoginRequest,
): Promise<[User, string]> {
  let result = await pool.query('select * from user_account where email = $1', [
    login.email,
  ]);

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  let user = new User(
    result.rows[0].id,
    result.rows[0].email,
    result.rows[0].passwordhash,
    result.rows[0].name,
    result.rows[0].age,
  );
  let match = await bcrypt.compare(login.password, user.passwordHash);
  if (!match) {
    throw new Error('Invalid email or password');
  }

  let token = await pool.query(
    "insert into user_token (id, user_id, expiration_date) values (gen_random_uuid(), $1, now() + interval '1 day') returning *",
    [user.id],
  );

  return [user, token.rows[0].id];
}

export async function logoutUser(pool: Pool, token: string): Promise<void> {
  await pool.query('delete from user_token where id = $1', [token]);
}

export async function loginWithToken(pool: Pool, token: string): Promise<User> {
  let result = await pool.query(
    'select * from user_account where id = (select user_id from user_token where id = $1 and expiration_date >= current_timestamp)',
    [token],
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid token');
  }

  return new User(
    result.rows[0].id,
    result.rows[0].email,
    result.rows[0].passwordhash,
    result.rows[0].name,
    result.rows[0].age,
  );
}

export async function checkIfTokenLoggedIn(
  pool: Pool,
  token: string,
): Promise<boolean> {
  let result = await pool.query(
    'select * from user_account where id = (select user_id from user_token where id = $1 and expiration_date >= current_timestamp)',
    [token],
  );

  return result.rows.length !== 0;
}
