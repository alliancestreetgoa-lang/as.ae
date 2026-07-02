// Downloads all image/svg assets from alliancestreet.ae into public/images/
// Run: node scripts/download-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const A = 'https://cdn.prod.website-files.com/67470d8c022e394d33721189/';
const B = 'https://cdn.prod.website-files.com/67470d8c022e394d33721243/';

// [remoteUrl, localName]
const ASSETS = [
  [A + '67489cdf9152b6b7ddd4c841_logo%20new.png', 'logo-white.png'],
  [A + '6749d636b9da5c001ef01473_logo%20black.png', 'logo-black.png'],
  [A + '67470d8c022e394d337214aa_close-btn.svg', 'close-btn.svg'],
  [A + '67470d8c022e394d33721479_menu-btn.svg', 'menu-btn.svg'],
  [A + '67477e9b66a1e6bb45731445_Rectangle%205.svg', 'rectangle-5.svg'],
  [A + '67477cf53a58ca27c2395c22_arrow-narrow-right-2.png', 'arrow-right.png'],
  [B + '6747823d174f3a10941dd1d8_Graph%20New.png', 'graph-new.png'],
  [B + '674780e9f4ff89bc7b9d1bff_Vector.png', 'vector-1.png'],
  [B + '674781e8dde8a64489569998_Vector.png', 'vector-2.png'],
  [B + '674780893aa3fe75e8d09b6d_Vector.png', 'vector-3.png'],
  [A + '6749ecac9bc00e909647d71c_Group%20289298-2.png', 'graph-card.png'],
  [A + '67caafaa87f4478e6a1b5398_Untitled3.jpg', 'mission-team.jpg'],
  [A + '67cab148bf6fd6a98a83bb0b_2.jpg', 'photo-2.jpg'],
  [A + '67cab148641e95b46d4205e9_1.jpg', 'values-meeting.jpg'],
  [A + '674777ff7351747641ad2683_Alliance%20Street%20Consultancy%20Reviews.png', 'reviews.png'],
  [A + '67477f32a4767e32f4f33bf7_Vector%203.png', 'vector-red.png'],
  [A + '67c5b19a9f6720426dce2c0a_strategy-min.jpg', 'strategy.jpg'],
  [A + '6749b65868648ac6c6800355_businesswoman-getting-taxi-cab_23-2149236689.jpg', 'businesswoman.jpg'],
  [A + '6749cdfae51d41eeb6c2da12_bank.jpg', 'bank.jpg'],
  [A + '67c5b24d08be3ab79afd2002_compliance-min.jpg', 'compliance.jpg'],
  [B + '6916dfa8c0e605c461470639_Dubai%20Dreams%20%26%20Tax%20Free%20Schemes%20-%20cover.png', 'book-cover.png'],
  [B + '681aedbf1e41fe31b114ec63_mockup%20finall.png', 'book-mockup.png'],
  [B + '679cb110a022533dcfef9cb7_gulfnews-import-2024-09-13-Business_191ea99dfad_large.jpg.avif', 'pub-gulfnews.avif'],
  [B + '679cb1ddc0d3e288462eef83_1719860422815-0.jpg', 'pub-businessinsider.jpg'],
  [B + '679cb2a56ae72c74fcc3bc08_Navigating-UAE-Business-Formation-with-Stallone-Shaikh.png', 'pub-ceoweekly.png'],
  [B + '679cb378875d404c7ddc80bc_Untitled-design-1-750x375.png', 'pub-digitaljournal.png'],
  [B + '679cb4801140ae077b8d1ad8_image.khaleejtimes.com.jpeg', 'pub-khaleejtimes.jpeg'],
  [A + '67c9b407da441e2f17c55a5f_6.png', 'orbit-6.png'],
  [A + '67c9b40736e444f07007ab80_2.png', 'orbit-2.png'],
  [A + '67c9b407aa2b8e3154d53236_5.png', 'orbit-5.png'],
  [A + '67470d8c022e394d337214db_Graph%20New.svg', 'graph-new.svg'],
  [A + '67c9b407b6d543efcb5298af_4.png', 'orbit-4.png'],
  [A + '67c9b408b122e7efc74656d0_3.png', 'orbit-3.png'],
  [A + '67470d8c022e394d337214dc_Lock%20Keyhole.svg', 'icon-lock.svg'],
  [A + '67c9b407b8a0268ba8a8fd06_1.png', 'orbit-1.png'],
  [A + '67470d8c022e394d337214da_Layers%20Minimalistic.svg', 'icon-layers.svg'],
  [A + '67486f84c14dc159d1e7effe_1684047548forbes-logo-white.png', 'press-forbes.png'],
  [A + '67487544bd49baa4e7809bc9_business%20insider.png', 'press-businessinsider.png'],
  [A + '67487326eae08633a12a8640_logo-white.png', 'press-khaleejtimes.png'],
  [A + '6748749c984842d9bbf4e736_BANNER-11.png', 'press-asiabusinessoutlook.png'],
  [A + '67487369e3b4ed0f923721d4_Benzinga_White_Large.png', 'press-benzinga.png'],
  [A + '67489d78fdad248dbc9c1678_footer%20logo.png', 'footer-logo.png'],
  [A + '6749a19952d11312060d1c15_32%20logo.png', 'favicon-32.png'],
  // CSS background images (not <img> tags)
  [A + '67c5af6919a483acca3ab610_team%20homepage.jpg', 'mission-team-homepage.jpg'],
  [A + '67c5b0dcce7c8ae30da639df_Stallone-min.jpg', 'values-stallone.jpg'],
];

const OUT = join(process.cwd(), 'public', 'images');

async function download([url, name]) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(OUT, name), buf);
    console.log(`  ✓ ${name} (${(buf.length / 1024).toFixed(0)}kb)`);
    return true;
  } catch (e) {
    console.error(`  ✗ ${name} — ${e.message}`);
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Downloading ${ASSETS.length} assets to public/images/ ...`);
  let ok = 0;
  // batch 5 at a time
  for (let i = 0; i < ASSETS.length; i += 5) {
    const batch = ASSETS.slice(i, i + 5);
    const results = await Promise.all(batch.map(download));
    ok += results.filter(Boolean).length;
  }
  console.log(`Done: ${ok}/${ASSETS.length} downloaded.`);
}

main();
