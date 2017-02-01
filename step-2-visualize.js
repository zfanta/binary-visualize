'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

let inputDir = 'C:\\Users\\zfanta\\Downloads\\dataSampleHexMatrix';
let outputDirectory = 'C:\\Users\\zfanta\\Downloads\\dataSampleHexMatrixImage';

mkdirp(outputDirectory);

let files = fs.readdirSync(inputDir).filter((filename) => {
  return filename.endsWith('.matrix.json');
});

let count = 1;
for (let file of files) {
  visualize(file);
  console.log(file, `${count}/${files.length}`);count++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function visualize(file) {
  let fullPath = path.join(inputDir, file);
  let buffer = makeBitmapHeader();

  let matrix = JSON.parse(fs.readFileSync(fullPath));
  let offset = 0x36;
  for (let line of matrix) {
    for (let pixel of line) {
      buffer.writeUIntLE(pixel, offset, 3);
      offset += 3;
    }
  }
  fs.writeFileSync(path.join(outputDirectory, file) + '.bmp', buffer)
}

function makeBitmapHeader() {
  let buffer = Buffer.allocUnsafe(196662);  //TODO
  buffer.write('BM', 0);  //CHAR bfType[2]
  buffer.writeUInt32LE(196662, 2);  //DWORD bfSize
  buffer.writeUInt16LE(0, 6);  //WORD bfReserved1
  buffer.writeUInt16LE(0, 8);  //WORD bfReserved2
  buffer.writeUInt32LE(54, 0xA); //DWORD bfOffBits

  buffer.writeUInt32LE(40, 0xE);  //DWORD biSize
  buffer.writeUInt32LE(256, 0x12); //LONG biWidth
  buffer.writeUInt32LE(256, 0x16); //LONG biHeight
  buffer.writeUInt16LE(1, 0x1A);  //WORD biPlanes
  buffer.writeUInt16LE(24, 0x1C); //WORD biBitCount
  buffer.writeUInt32LE(0, 0x1E);  //DWORD biCompression
  buffer.writeUInt32LE(196608, 0x22);  //DWORD biSizeImage
  buffer.writeUInt32LE(0, 0x26);  //LONG biXPelsPerMeter
  buffer.writeUInt32LE(0, 0x2A);  //LONG biYPelsPerMeter
  buffer.writeUInt32LE(0, 0x2E);  //DWORD biClrUsed
  buffer.writeUInt32LE(0, 0x32);  //DWORD biClrImportant

  return buffer;
}