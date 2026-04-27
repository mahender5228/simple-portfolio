const fs = require('fs');
const pdfPath = 'C:\\Users\\tonys\\Downloads\\Mahender_Bhambhu_Resume.pdf';
const buf = fs.readFileSync(pdfPath);

// Extract readable text from PDF binary using regex for plain text streams
const raw = buf.toString('latin1');

// Extract text between BT and ET markers (PDF text objects)
const matches = [];
const re = /BT[\s\S]*?ET/g;
let m;
while ((m = re.exec(raw)) !== null) {
  const block = m[0];
  // Extract strings in parentheses
  const strRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
  let s;
  while ((s = strRe.exec(block)) !== null) {
    const txt = s[1].replace(/\\n/g,' ').replace(/\\\(/g,'(').replace(/\\\)/g,')').replace(/\\\\/g,'\\').trim();
    if (txt.length > 1) matches.push(txt);
  }
}
console.log(matches.join('\n'));
