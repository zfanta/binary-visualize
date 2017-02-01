'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

let inputDir = 'C:\\Users\\zfanta\\Downloads\\dataSampleHex';
let outputDirectory = 'C:\\Users\\zfanta\\Downloads\\dataSampleHexMatrix';

mkdirp(outputDirectory);

let files = fs.readdirSync(inputDir).filter((filename) => {
  return filename.endsWith('.hex');
});

let count = 1;
for (let file of files) {
  jsonize(path.join(inputDir, file));
  console.log(file, `${count}/${files.length}`);count++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function jsonize(file) {
  let buffer = fs.readFileSync(file);
  let matrix = makeMatrix();

  for (let i = 1; i < buffer.length; i++) {
    let x = buffer[i-1];
    let y = buffer[i];
    matrix[x][y] = matrix[x][y] + 1;
  }
  fs.writeFileSync(path.join(outputDirectory, path.basename(file, '.hex')) + '.matrix.json', JSON.stringify(matrix));
}

function makeMatrix() {
  let matrix = [];
  for (let i = 0; i < 256; i++) {
    let row = [];
    for (let j = 0; j < 256; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}
