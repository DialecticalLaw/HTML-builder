const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Hello! Write your text: ');

fs.writeFile(path.join(__dirname, 'yourText.txt'), '', (err) => {
  if (err) throw err;
});

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.emit('SIGINT');
  }

  fs.appendFile(path.join(__dirname, 'yourText.txt'), data, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  stdout.write('Goodbye, User!');
  process.exit();
});