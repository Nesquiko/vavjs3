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
	type_id uuid references ride_type(id) on delete set null,
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

const SEED_AD_SQL = `INSERT INTO public.ad VALUES ('38469554-300f-4a04-b231-0b209f2ecfda', 'https://cdn.alza.sk/Foto/or/lp/splatky/img/header.png', 'https://www.alza.sk/', 1) ON CONFLICT DO NOTHING;`;
const SEED_USER_SQL = `
INSERT INTO public.user_account VALUES ('36e24ef0-c03a-4b5a-b385-e24e1dafd913', 'abc@gmail.com', 'abc', '$2b$10$CpHHJsi6ebcPq6Zcys9fre9EyKIrJFfoWqZaJ/DV6qEfN9DdZc3au', 23) ON CONFLICT DO NOTHING;
INSERT INTO public.user_account VALUES ('4f2d45da-773d-44f1-8953-e5da650aa85a', 'def@gmail.com', 'BC', '$2b$10$Lj6AUXDyoy25JAVyd9Y9guat7zk/WIGfmDwI7y5w/TwK8xgex3tLG', 20) ON CONFLICT DO NOTHING;
INSERT INTO public.user_account VALUES ('0f74f5ee-cabf-4d53-a530-f557c389afbe', 'ghi@gmail.com', 'ghu', '$2b$10$uzO4/EJiLDE//NUpC5R7R.gi7dE3j.nKLFcVcZv8RAUxp/MTWBcXe', 87) ON CONFLICT DO NOTHING;
INSERT INTO public.user_account VALUES ('50b9943f-c409-4324-b9d8-db45f30ad2c5', 'bhu@gmail.com', '123', '$2b$10$muAG3OV4PWBS4XUYdQY6cObv9uevpGO0iU6OQ/72pCTxyp6kbKbS.', 20) ON CONFLICT DO NOTHING;
INSERT INTO public.user_account VALUES ('74fc3af9-244d-475c-9151-9f1a793a7813', 'admin', 'admin', '$2a$10$E2.zSvmlg1R2VMJHNhGyVOYXSC9ItTmUIfiHBb3x3dOxBqtVXyPKa', 20) ON CONFLICT DO NOTHING;
`;
const SEED_RIDE_TYPE_SQL = `
INSERT INTO public.ride_type VALUES ('d46b9971-4812-473b-84ab-8e41ce834764', 'eco', 'I don''t have enough gas...', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.ride_type VALUES ('ed16456b-2693-4de5-a559-d77263356053', 'race mode', 'today I feel like Schumacher', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
`;

const SEED_CONSUMPTION_SQL = `
INSERT INTO public.consumption VALUES ('bbfee25d-9f9a-467c-a1b2-891850faaf03', '2023-11-14', 1240, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d99716-89e2-11ee-b9d1-0242ac120002', '2023-11-15', 690, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d99af4-89e2-11ee-b9d1-0242ac120002', '2023-11-17', 850, NULL, '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d99cfc-89e2-11ee-b9d1-0242ac120002', '2023-11-19', 700, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d99ed2-89e2-11ee-b9d1-0242ac120002', '2023-11-20', 930, NULL, '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d9a09e-89e2-11ee-b9d1-0242ac120002', '2023-11-21', 1050, NULL, '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d9a594-89e2-11ee-b9d1-0242ac120002', '2023-11-22', 680, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.consumption VALUES ('08d9a760-89e2-11ee-b9d1-0242ac120002', '2023-11-23', 1250, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
`;

const SEED_DURATION_SQL = `
INSERT INTO public.duration VALUES ('60036631-f554-45fa-a2a2-b2e81a1c7a4f', '2023-11-15', 4550, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('51884dd2-89e1-11ee-b9d1-0242ac120002', '2023-11-16', 1550, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('51885444-89e1-11ee-b9d1-0242ac120002', '2023-11-19', 3900, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('51885624-89e1-11ee-b9d1-0242ac120002', '2023-11-20', 1275, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('51885746-89e1-11ee-b9d1-0242ac120002', '2023-11-21', 6500, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('5188587c-89e1-11ee-b9d1-0242ac120002', '2023-11-23', 2060, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('5188530e-89e1-11ee-b9d1-0242ac120002', '2023-11-18', 8800, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.duration VALUES ('518851b0-89e1-11ee-b9d1-0242ac120002', '2023-11-17', 1500, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
`;

const SEED_ROUTE_SQL = `
INSERT INTO public.route VALUES ('ba0ccd6c-1e6b-4e59-80bd-8d7271c56641', '2023-11-13', 3250, NULL, '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('10995ce8-87a8-11ee-b9d1-0242ac120002', '2023-11-14', 4580, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('10995fc2-87a8-11ee-b9d1-0242ac120002', '2023-11-15', 2600, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('109961ac-87a8-11ee-b9d1-0242ac120002', '2023-11-16', 1350, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('10996350-87a8-11ee-b9d1-0242ac120002', '2023-11-17', 8752, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('10996788-87a8-11ee-b9d1-0242ac120002', '2023-11-19', 2078, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('109968f0-87a8-11ee-b9d1-0242ac120002', '2023-11-20', 3270, 'ed16456b-2693-4de5-a559-d77263356053', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('109968f0-87a8-11ee-b9d1-02425c120002', '2023-11-22', 1550, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
INSERT INTO public.route VALUES ('10996486-87a8-11ee-b9d1-0242ac120002', '2023-11-18', 8752, 'd46b9971-4812-473b-84ab-8e41ce834764', '74fc3af9-244d-475c-9151-9f1a793a7813') ON CONFLICT DO NOTHING;
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
  client.query(SEED_AD_SQL);
  client.query(SEED_USER_SQL);
  client.query(SEED_RIDE_TYPE_SQL);
  client.query(SEED_CONSUMPTION_SQL);
  client.query(SEED_DURATION_SQL);
  client.query(SEED_ROUTE_SQL);
  client.release();
}
