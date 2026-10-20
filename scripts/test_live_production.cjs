async function testLive() {
  const baseUrl = 'https://landing-page-cemim.vercel.app';
  console.log(`Probando API en producción: ${baseUrl}/api/admin/resources`);

  const res = await fetch(`${baseUrl}/api/admin/resources?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });

  console.log('Status code:', res.status);
  const json = await res.json();
  console.log('Success:', json.success);
  console.log('Total de recursos en producción:', json.data?.length);

  const books = json.data?.filter(r => r.type === 'libro') || [];
  const audios = json.data?.filter(r => r.type === 'audio') || [];
  const videos = json.data?.filter(r => r.type === 'video') || [];

  console.log(`Libros: ${books.length}`);
  console.log(`Audios: ${audios.length}`);
  console.log(`Videos: ${videos.length}`);

  // Test pagination calculation
  const ITEMS_PER_PAGE = 26;
  const pages = Math.ceil(books.length / ITEMS_PER_PAGE);
  console.log(`Total páginas calculadas: ${pages}`);

  console.log('\nPrimer libro en producción:', books[0]?.title);
  console.log('Libro #26 (fin de página 1):', books[25]?.title);
  console.log('Libro #27 (inicio de página 2):', books[26]?.title);
  console.log('Último libro (#80):', books[books.length - 1]?.title);

  // Test landing page HTML
  const pageRes = await fetch(baseUrl);
  console.log('\nLanding page HTTP Status:', pageRes.status);
  const html = await pageRes.text();
  console.log('Landing page HTML contains "Repositorio Abierto Multimedia":', html.includes('Repositorio Abierto Multimedia'));
  console.log('Landing page HTML length:', html.length);
}

testLive().catch(console.error);
