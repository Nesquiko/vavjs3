import { Pool } from 'pg';

const INIT_USER_SQL = `
create table if not exists user_account (
	id uuid primary key,
    email text unique not null,
	name varchar(255) not null,
	passwordHash varchar(72) not null,
	age int not null
);
`;

const INIT_RIDE_TYPE_SQL = `
create table if not exists ride_type (
	id uuid primary key,
    name varchar(255) not null,
	description text
);
`;

const RIDE_TABLE_FORMAT = `
create table if not exists REPLACE (
	id uuid primary key,
    date date not null,
	value int not null,
	type uuid not null references ride_type(id),
	user_id uuid not null references user_account(id)
);
`;

const INIT_ROUTE_SQL = RIDE_TABLE_FORMAT.replace('REPLACE', 'route');
const INIT_DURATION_SQL = RIDE_TABLE_FORMAT.replace('REPLACE', 'duration');
const INIT_CONSUMP_SQL = RIDE_TABLE_FORMAT.replace('REPLACE', 'consumption');

const INIT_AD_SQL = `
create table if not exists ad (
	id uuid primary key,
	image_url text not null,
	link text not null,
	counter int not null
);
`;

export async function initDb(pool: Pool) {
  let client = await pool.connect();
  client.query(INIT_USER_SQL);
  client.query(INIT_RIDE_TYPE_SQL);
  client.query(INIT_ROUTE_SQL);
  client.query(INIT_DURATION_SQL);
  client.query(INIT_CONSUMP_SQL);
  client.query(INIT_AD_SQL);
  client.release();
}
