async function testAudios() {
  const audios = [
    { id: '1F99fFd4fUTMGHCsdzz66wNMdGQdpto3f', name: '02 La mina terrestre de la indolencia.mp3' },
    { id: '1oh15HhQz6bl7mguw6GJ1bG_8y18K7k9-', name: '03 La mina terrestre del rencor.mp3' },
    { id: '1hmtJ9liBY7teZk18DkseuBFSVcQxjSTd', name: '04 La mina terrestre del temor.mp3' },
    { id: '1YlTQU2_d-pdxK4wPaT1Vmdre2QH3rGaP', name: '05 La mina terrestre de los pecados sexuales.mp3' },
    { id: '1TKlLzSfmV9m5yLmUXgZQooDrKCaUCu-D', name: 'La Increíble Historia de ENOC.mp3' },
    { id: '1b6yi9LpL9wlly3aRN3UsYACyP735U2un', name: 'La Historia de JOB.mp3' }
  ];

  for (const a of audios) {
    const url = `https://drive.usercontent.google.com/download?id=${a.id}&export=download&confirm=t`;
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const len = res.headers.get('content-length');
      const mb = len ? (Number(len) / (1024 * 1024)).toFixed(2) : 'unknown';
      console.log(`Audio: "${a.name}" - Size: ${mb} MB (Status: ${res.status})`);
    } catch (e) {
      console.log(`Audio: "${a.name}" - Error:`, e.message);
    }
  }
}

testAudios().catch(console.error);
