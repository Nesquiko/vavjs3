import { Pool } from 'pg';

const INIT_USER_SQL = `
create table if not exists user_account (
	id uuid primary key,
    email text unique not null,
	name varchar(255) not null,
	passwordHash varchar(72) not null,
	age int not null
);

insert into user_account (id, email, name, passwordHash, age) values
(gen_random_uuid(), 'admin', 'admin', '$2a$10$E2.zSvmlg1R2VMJHNhGyVOYXSC9ItTmUIfiHBb3x3dOxBqtVXyPKa', 20)
on conflict do nothing;
`;

const INIT_TOKEN_SQL = `
create table if not exists user_token (
	id uuid primary key,
	user_id uuid not null references user_account(id) on delete cascade,
	expiration_date date not null
);
`;

const INIT_RIDE_TYPE_SQL = `
create table if not exists ride_type (
	id uuid primary key,
    name varchar(255) not null,
	description text,
	user_id uuid not null references user_account(id) on delete cascade
);
`;

const RIDE_TABLE_FORMAT = `
create table if not exists REPLACE (
	id uuid primary key,
    date date not null,
	value int not null,
	type uuid not null references ride_type(id),
	user_id uuid not null references user_account(id),
	created_at timestamp not null 
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

insert into ad (id, image_url, link, counter) values
('38469554-300f-4a04-b231-0b209f2ecfda', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.alza.sk%2Fsplatky&psig=AOvVaw2lF4tG3MOnQF84ShsLiG3Z&ust=1700415725897000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLCipqyMzoIDFQAAAAAdAAAAABAE', 'https://www.alza.sk', 0)
on conflict do nothing;
`;

export async function initDb(pool: Pool) {
  let client = await pool.connect();
  client.query(INIT_USER_SQL);
  client.query(INIT_TOKEN_SQL);
  client.query(INIT_RIDE_TYPE_SQL);
  client.query(INIT_ROUTE_SQL);
  client.query(INIT_DURATION_SQL);
  client.query(INIT_CONSUMP_SQL);
  client.query(INIT_AD_SQL);
  client.release();
}
