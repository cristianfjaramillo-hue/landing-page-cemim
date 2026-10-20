const fs = require('fs');

async function inspectHtml() {
  const res = await fetch('https://drive.google.com/drive/folders/1aEQjfWyvSVbCAyOUezX-iUDj99qLdPWr?usp=sharing', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  // Find occurrences of .pdf
  let idx = 0;
  const samples = [];
  while ((idx = html.indexOf('.pdf', idx)) !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(html.length, idx + 100);
    samples.push(html.substring(start, end));
    idx += 4;
    if (samples.length >= 5) break;
  }
  
  console.log('Sample matches around .pdf:');
  samples.forEach((s, i) => console.log(`--- Match ${i+1} ---\n`, s));
}

inspectHtml();
