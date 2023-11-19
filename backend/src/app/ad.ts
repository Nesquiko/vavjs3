import { Pool } from 'pg';

export class Ad {
  constructor(id: string, imageUrl: string, link: string, counter: number) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.link = link;
    this.counter = counter;
  }

  id: string;
  imageUrl: string;
  link: string;
  counter: number;
}

export async function getAd(pool: Pool): Promise<Ad> {
  let ad = await pool.query('select * from ad');
  return new Ad(
    ad.rows[0].id,
    ad.rows[0].image_url,
    ad.rows[0].link,
    ad.rows[0].counter,
  );
}

export async function updateAd(pool: Pool, ad: Ad) {
  await pool.query(
    'update ad set image_url = $1, link = $2, counter = 0 where id = $3 returning *',
    [ad.imageUrl, ad.link, ad.id],
  );
  return new Ad(ad.id, ad.imageUrl, ad.link, 0);
}

export async function incrementAdCounter(pool: Pool, adId: string) {
  await pool.query('update ad set counter = counter + 1 where id = $1', [adId]);
}
