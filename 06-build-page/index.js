const path = require('path');
const fs = require('fs');

async function buildPage() {
  await clearDir();
  await createHtml();
  await mergeStyles();
  await copyAssets();
}

async function clearDir() {
  let isDirExist;
  await new Promise((resolve) => {
    fs.access(path.join(__dirname, 'project-dist'), (err) => {
      if (err) {
        isDirExist = false;
      } else {
        isDirExist = true;
      }
      resolve();
    })
  })
  if (isDirExist) {
    await new Promise((resolve) => {
      fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
        if (err) throw err;
        resolve();
      })
    })
  }

  await new Promise((resolve) => {
    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
      if (err) throw err;
      resolve();
    })
  })
}

async function createHtml() {
  let templateData = await new Promise((resolve) => {
    fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  })
  
  const fileNames = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      resolve(files);
    })
  })

  for (let fileName of fileNames) {
    if (fileName.isDirectory() || fileName.name.slice(-4) !== 'html') continue;
    const htmlData = await new Promise((resolve) => {
      fs.readFile(path.join(__dirname, 'components', fileName.name), 'utf-8', (err, data) => {
        if (err) throw err;
        resolve(data);
      })
    })
    templateData = templateData.replaceAll(`{{${fileName.name.slice(0, -5)}}}`, htmlData);
  }

  await new Promise((resolve) => {
    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateData, (err) => {
      if (err) throw err;
      resolve();
    })
  })
}

async function mergeStyles() {
  await new Promise((resolve) => {
    fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
      if (err) throw err;
      resolve()
    })
  })

  const cssFiles = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      resolve(files);
    })
  })

  let cssData = [];

  for (let cssFile of cssFiles) {
    if (cssFile.isDirectory() || cssFile.name.slice(-3) !== 'css') continue;
    await new Promise((resolve) => {
      fs.readFile(path.join(__dirname, 'styles', cssFile.name), 'utf-8', (err, data) => {
        if (err) throw err;
        cssData.push(data);
        resolve();
      })
    })
  }

  for (let data of cssData) {
    await new Promise((resolve) => {
      fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data, (err) => {
        if (err) throw err;
        resolve()
      })
    })
  }
}

async function copyAssets() {
  await new Promise((resolve) => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
      if (err) throw err;
      resolve();
    })
  })

  const fileNames = await new Promise((resolve) => {
    fs.readdir(path.join(__dirname, 'assets'), { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      resolve(files);
    })
  })

  for (let fileName of fileNames) {
    if (fileName.isDirectory()) continue;
    await new Promise((resolve) => {
      fs.copyFile(path.join(__dirname, 'assets', fileName.name), path.join(__dirname, 'project-dist', 'assets', fileName.name), (err) => {
        if (err) throw err;
        resolve();
      })
    })
  }

  for (let dirName of fileNames) {
    if (!dirName.isDirectory()) continue;
    const dirFiles = await new Promise((resolve) => {
      fs.readdir(path.join(__dirname, 'assets', dirName.name), { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        resolve(files);
      })
    })

    await new Promise((resolve) => {
      fs.mkdir(path.join(__dirname, 'project-dist', 'assets', dirName.name), { recursive: true }, (err) => {
        if (err) throw err;
        resolve();
      })
    })

    for (let file of dirFiles) {
      if (file.isDirectory()) continue;
      await new Promise((resolve) => {
        fs.copyFile(path.join(__dirname, 'assets', dirName.name, file.name), path.join(__dirname, 'project-dist', 'assets', dirName.name, file.name), (err) => {
          if (err) throw err;
          resolve();
        })
      })
    }
  }
}

buildPage();