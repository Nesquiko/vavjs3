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

enum RideEntryType {
  ROUTE = 'route',
  DURATION = 'duration',
  CONSUMPTION = 'consumption',
}

export class RideEntry {
  public id: string;
  public date: Date;
  public value: number;
  public typeId: string;
  public typeName: string;
  public rideEntryType: RideEntryType;

  constructor(
    id: string,
    date: Date,
    value: number,
    typeId: string,
    typeName: string,
    rideEntryType: RideEntryType,
  ) {
    this.id = id;
    this.date = date;
    this.value = value;
    this.typeId = typeId;
    this.typeName = typeName;
    this.rideEntryType = rideEntryType;
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

export async function saveRideEntry(
  pool: Pool,
  rideEntry: RideEntry,
  user: User,
): Promise<RideEntry> {
  let query =
    'insert into REPLACE (id, date, value, type_id, user_id) values (gen_random_uuid(), $1, $2, $3, $4) returning *'.replace(
      'REPLACE',
      rideEntry.rideEntryType,
    );

  let result = await pool.query(query, [
    rideEntry.date,
    rideEntry.value,
    rideEntry.typeId === '' ? null : rideEntry.typeId,
    user.id,
  ]);

  return new RideEntry(
    result.rows[0].id,
    result.rows[0].date,
    result.rows[0].value,
    result.rows[0].type_id,
    rideEntry.typeName,
    rideEntry.rideEntryType,
  );
}

export async function getUserRides(
  pool: Pool,
  user: User,
): Promise<RideEntry[]> {
  let query =
    'select r.id, r.date, r.value, rt.id as rt_id, rt.name from REPLACE r left join ride_type rt on r.type_id = rt.id where r.user_id = $1';

  let result = Array<RideEntry>();
  let rideEntryTypes = Array.from(['route', 'duration', 'consumption']);
  for (let rideEntryType of rideEntryTypes) {
    let q = query.replace('REPLACE', rideEntryType);
    let rides = await pool.query(q, [user.id]);
    rides.rows.forEach((row) => {
      let rideEntry = new RideEntry(
        row.id,
        row.date,
        row.value,
        row.rt_id,
        row.name,
        RideEntryType[rideEntryType.toUpperCase()],
      );
      result.push(rideEntry);
    });
  }

  return result;
}

export async function deleteRideEntry(
  pool: Pool,
  id: string,
  entryType: RideEntryType,
  user: User,
): Promise<void> {
  let query = 'delete from REPLACE where id = $1 and user_id = $2'.replace(
    'REPLACE',
    entryType,
  );

  await pool.query(query, [id, user.id]);
}
