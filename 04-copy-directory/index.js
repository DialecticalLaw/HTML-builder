const path = require('path');
const fs = require('fs');

async function copyDir() {
  await new Promise((resolve) => {
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;
    resolve();
  })})

  await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      })
    }
    resolve();
  })})

  const fileNames = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) throw err;
    resolve(files);
  })})

  for (let fileName of fileNames) {
    fs.copyFile(path.join(__dirname, 'files', fileName), path.join(__dirname, 'files-copy', fileName), (err) => {
      if (err) throw err;
    })
  }
}

copyDir();