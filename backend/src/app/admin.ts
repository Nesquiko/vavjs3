import { Pool } from 'pg';
import { NewUserRequest, User, registerUser } from './user';

export async function getAllUsers(pool: Pool): Promise<User[]> {
  let result = await pool.query<User>(
    'select * from user_account order by name',
  );
  return result.rows;
}

export async function addUser(
  pool: Pool,
  newUser: NewUserRequest,
): Promise<User> {
  return await registerUser(pool, newUser);
}

export async function deleteUser(pool: Pool, id: string): Promise<void> {
  await pool.query('delete from user_account where id = $1', [id]);
}
