const fs = require('fs');
const path = require('path');

async function getFilesInfo() {
  const fileNames = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    resolve(files);
  })})

  for (let i = 0; i < fileNames.length; i += 1) {
    if (fileNames[i].isDirectory()) continue;
    const fileName = path.parse(path.join(fileNames[i].path, fileNames[i].name)).name;
    const fileExt = path.extname(path.join(fileNames[i].path, fileNames[i].name)).slice(1);
    const fileSize = await new Promise((resolve, reject) => {
      fs.stat(path.join(fileNames[i].path, fileNames[i].name), (err, stats) => {
        if (err) throw err;
        resolve(stats.size / 1024);
      });
    })
    console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
  }
}

getFilesInfo();