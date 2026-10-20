async function inspectWarningPage() {
  const id = '1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5';
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  const res = await fetch(url);
  const html = await res.text();
  console.log('--- Warning page HTML ---');
  console.log(html);
}

inspectWarningPage();
