const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request');
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exist');
      } else {
        let isError = false;
        const limitSizeStream = new LimitSizeStream({limit: Math.pow(2, 20)});
        const writeFileStream = fs.createWriteStream(filepath);

        req
          .pipe(limitSizeStream)
          .pipe(writeFileStream);

        req.on('aborted', () => {
          isError = true;

          writeFileStream.end();
          removeFile();
        });

        limitSizeStream.on('error', (error) => {
          isError = true;

          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('File size exceed limit');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }

          writeFileStream.end();
          removeFile();
        });

        writeFileStream.on('error', (error) => {
          isError = true;

          if (error.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File already exist');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
            removeFile();
          }
        });

        writeFileStream.on('finish', () => {
          if (!isError) {
            res.statusCode = 201;
            res.end('ok');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  function removeFile() {
    fs.unlink(filepath, () => {
    });
  }
});


module.exports = server;
