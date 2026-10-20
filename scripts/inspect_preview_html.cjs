async function inspectPreviewHtml() {
  const url = 'https://drive.google.com/file/d/1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5/preview';
  const res = await fetch(url);
  const html = await res.text();
  console.log('HTML length:', html.length);
  // Find video or audio tags or player components
  const hasAudio = html.includes('<audio') || html.includes('drive-viewer') || html.includes('videoplayer');
  console.log('Contains player components:', hasAudio);

  // Look for direct stream URLs inside the preview page!
  const regex = /https:\/\/[^"'\s\\]+drive\.google\.com\/[^"'\s\\]+/g;
  const matches = html.match(regex);
  console.log('Sample Google URLs inside preview:', matches ? matches.slice(0, 5) : 'none');
}

inspectPreviewHtml();
