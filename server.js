//
// This file is only ment for testing cloudno.de API
//
const http = require('http');
const util = require('util');

const app_port = process.env.app_port || 8080;
const app_host = process.env.app_host || '127.0.0.1';

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World from Cloudnode\n\n');
    res.end();
  })
  .listen(app_port);
console.log(`Web server running at http://${app_host}:${app_port}`);
