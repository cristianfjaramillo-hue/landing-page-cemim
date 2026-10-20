async function checkBothPreviews() {
  for (const id of ['1MCDl0e57rHSAI-OyDQyoH-9xapgit0B5', '1BO-JQJD7BQX9LrjrERbdEzz5eA7ReTXG']) {
    const res = await fetch(`https://drive.google.com/file/d/${id}/preview`);
    const text = await res.text();
    console.log(`ID ${id}: status=${res.status}, contains "ServiceLogin"? ${text.includes('ServiceLogin')}, contains "videoplayer"? ${text.includes('videoplayer')}`);
  }
}
checkBothPreviews();
