const ids = [
  { name: 'SOCORRO', id: '1EhOWotbcCYxc3v3qwYDrCCXE0hgmELfp' },
  { name: 'EL ENREJADO Y LA VID', id: '1XNYL3j0bwe5CkN1gp9HHGvhbhaBHRPI0' },
  { name: 'EL PLAN MARAVILLOSO', id: '150l23oeXF7IB3mOgxf-gqcG4_CvnnN4K' }
];

async function checkIds() {
  for (const item of ids) {
    const url = `https://drive.google.com/file/d/${item.id}/view`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/) || html.match(/<title>([^<]+)<\/title>/);
    console.log(item.name, '-> Title in Drive:', titleMatch ? titleMatch[1] : 'Unknown');

    // Also check parent folder in HTML
    const parentMatch = html.match(/\["([a-zA-Z0-9_-]{25,})",\["([^"]+?)"/);
    if (parentMatch) {
      console.log('   Parent match:', parentMatch[1], parentMatch[2]);
    }
  }
}

checkIds().catch(console.error);
