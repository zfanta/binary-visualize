'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

let inputDir = 'C:\\Users\\zfanta\\Downloads\\dataSample';
let outputDirectory = 'C:\\Users\\zfanta\\Downloads\\dataSampleHex';

mkdirp(outputDirectory);

let files = fs.readdirSync(inputDir).filter((filename) => {
  return filename.endsWith('.bytes');
});

let count = 1;
for (let file of files) {
  binarize(path.join(inputDir, file));
  console.log(file, `${count}/${files.length}`);count++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function binarize(file) {
  let hexSequenceInString = fs.readFileSync(file).toString().replace(/[\da-zA-Z]{8} /g, '').replace(/\r\n/g, ' ').split(' ');
  let buffer = Buffer.allocUnsafe(hexSequenceInString.length);
  let offset = 0;
  for (let hexString of hexSequenceInString) {
    let hex = hexString === '??' ? 0 : parseInt(hexString, 16);
    buffer.writeUInt8(hex, offset);
    offset++;
  }
  fs.writeFileSync(path.join(outputDirectory, path.basename(file, '.bytes')) + '.hex', buffer);
}
