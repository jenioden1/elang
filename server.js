/**
 * ELANG PRIATIM - LOCAL SERVER
 * Bank Indonesia Kantor Perwakilan Tasikmalaya
 * 
 * Server lokal ringan untuk menyajikan website Elang Priatim dengan origin http://localhost
 * sehingga video YouTube dapat diputar langsung di dalam popup modal tanpa Error 153.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const INITIAL_PORT = 8080;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

function createServer() {
    return http.createServer((req, res) => {
        let safeUrl = decodeURI(req.url.split('?')[0]);
        if (safeUrl === '/' || safeUrl === '') {
            safeUrl = '/index.html';
        }

        const filePath = path.join(__dirname, safeUrl);

        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('403 Akses Ditolak');
            return;
        }

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Halaman atau File Tidak Ditemukan');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': stats.size,
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });

            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        });
    });
}

function startServer(port) {
    const srv = createServer();

    srv.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`  [INFO] Port ${port} sedang dipakai, mencoba port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });

    srv.listen(port, 'localhost', () => {
        console.log('======================================================================');
        console.log('  ELANG PRIATIM - BANK INDONESIA KANTOR PERWAKILAN TASIKMALAYA');
        console.log(`  Web Server Aktif di: http://localhost:${port}/`);
        console.log('======================================================================');
        console.log('  Status: Siap! Video YouTube kini dapat diputar langsung di popup.');
        console.log('  Browser default Anda akan terbuka secara otomatis...');
        console.log('  (Tekan Ctrl + C di jendela ini jika ingin mematikan server)');
        console.log('======================================================================\n');

        const openCmd = process.platform === 'win32' ? `start http://localhost:${port}/index.html` :
                        process.platform === 'darwin' ? `open http://localhost:${port}/index.html` :
                        `xdg-open http://localhost:${port}/index.html`;

        exec(openCmd, (err) => {
            if (err) {
                console.log(`Buka tautan ini di browser Anda: http://localhost:${port}/index.html`);
            }
        });
    });
}

startServer(INITIAL_PORT);
