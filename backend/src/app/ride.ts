import { Pool } from 'pg';
import { User } from './user';

export class RideType {
  public id: string;
  public name: string;
  public description: string;
  public userId: string;

  constructor(id: string, name: string, description: string, userId: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
  }
}

export async function createRideType(
  pool: Pool,
  rideType: RideType,
  user: User,
): Promise<RideType> {
  let result = await pool.query(
    'insert into ride_type (id, name, description, user_id) values (gen_random_uuid(), $1, $2, $3) returning *',
    [rideType.name, rideType.description, user.id],
  );

  return new RideType(
    result.rows[0].id,
    result.rows[0].name,
    result.rows[0].description,
    result.rows[0].user_id,
  );
}

export async function getRideTypesOfUser(
  pool: Pool,
  user: User,
): Promise<RideType[]> {
  let result = await pool.query('select * from ride_type where user_id = $1', [
    user.id,
  ]);

  return result.rows.map(
    (row) => new RideType(row.id, row.name, row.description, row.user_id),
  );
}

export async function deleteRideType(
  pool: Pool,
  id: string,
  user: User,
): Promise<void> {
  await pool.query('delete from ride_type where id = $1 and user_id = $2', [
    id,
    user.id,
  ]);
}
