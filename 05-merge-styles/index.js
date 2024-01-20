const path = require('path');
const fs = require('fs');

async function mergeStyles() {
  await new Promise((resolve) => {
    fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
      if (err) resolve();
      resolve()
    })
  })

  await new Promise((resolve) => {
    fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
      if (err) throw err;
      resolve()
    })
  })

  const fileNames = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      resolve(files);
    })
  })

  let cssData = [];

  for (let fileName of fileNames) {
    if (fileName.isDirectory() || fileName.name.slice(-3) !== 'css') continue;
    await new Promise((resolve) => {
      fs.readFile(path.join(__dirname, 'styles', fileName.name), 'utf-8', (err, data) => {
        if (err) throw err;
        cssData.push(data);
        resolve();
      })
    })
  }

  for (let data of cssData) {
    await new Promise((resolve) => {
      fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (err) => {
        if (err) throw err;
        resolve()
      })
    })
  }
}

mergeStyles();