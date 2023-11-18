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

export async function exportUsers(pool: Pool): Promise<{ csv: string }> {
  let result = (await pool.query('select * from user_account')).rows.map(
    (u) => new User(u.id, u.email, u.passwordhash, u.name, u.age),
  );
  return { csv: usersToCsv(result) };
}

function usersToCsv(users: User[]) {
  const header = ['id', 'name', 'email', 'passworddHash', 'age'];

  const csv = [header.join(',')];
  users.forEach((u) => {
    csv.push([u.id, u.name, u.email, u.passwordHash, u.age].join(','));
  });

  return csv.join('\n');
}
