import fs from 'fs';
import path from 'path';
import http, { IncomingMessage, ServerResponse } from 'http';

const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const __dirname = path.resolve(path.dirname(''));

    // Determine the file path based on the request URL
    const filePath = path.join(__dirname, 'front', req.url === '/' ? 'index.html' : req.url || '');

    // Read the requested file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File not found' }));
            return;
        }

        res.writeHead(200);
        res.end(data);
    });
});


export default httpServer