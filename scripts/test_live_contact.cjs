async function testLiveContact() {
  const baseUrl = 'https://landing-page-cemim.vercel.app';
  console.log('Testing live HTML at:', baseUrl);

  const htmlRes = await fetch(baseUrl);
  const html = await htmlRes.text();

  console.log('HTML contains "cristian.f.jaramillo@gmail.com":', html.includes('cristian.f.jaramillo@gmail.com'));
  console.log('HTML still contains "contacto@cemim.org":', html.includes('contacto@cemim.org'));

  console.log('\nSending test registration to /api/contact...');
  const postRes = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Prueba Cristian F. Jaramillo',
      email: 'cristian.f.jaramillo@gmail.com',
      telefono: '+593 99 000 0000',
      interes: 'Entrenamiento Misionero Integral',
      mensaje: 'Prueba de recepción de registro desde la landing page CEMIM.'
    })
  });

  console.log('POST Status:', postRes.status);
  const postJson = await postRes.json();
  console.log('POST Response:', postJson);

  console.log('\nQuerying saved registrations via GET /api/contact...');
  const getRes = await fetch(`${baseUrl}/api/contact`);
  const getJson = await getRes.json();
  console.log('GET Registrations count:', getJson.data?.length);
  console.log('Latest registration:', getJson.data?.[0]);
}

testLiveContact().catch(console.error);
