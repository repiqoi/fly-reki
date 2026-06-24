// ============================================================
//  XHTTP + TLS Reverse Proxy — Dockfly
// ============================================================
//
//  داخل Dockfly → سرویس → تب Variables اینا رو اضافه کن:
//
//  ┌──────────────────┬─────────────────────────────────────┐
//  │ KEY              │ VALUE (مثال)                        │
//  ├──────────────────┼─────────────────────────────────────┤
//  │ TARGET_HOST      │ myserver.com  (دامین سرور اصلیت)   │
//  │ TARGET_PORT      │ 443                                 │
//  │ RELAY_PATH       │ /xhttp                              │
//  └──────────────────┴─────────────────────────────────────┘
//
//  PORT رو خودِ Dockfly خودکار inject میکنه — وارد نکن.
//
// ============================================================

const http  = require('http');
const https = require('https');

const PORT        = process.env.PORT        || 3000;
const TARGET_HOST = process.env.TARGET_HOST || '';
const TARGET_PORT = parseInt(process.env.TARGET_PORT || '443', 10);
const RELAY_PATH  = process.env.RELAY_PATH  || '/xhttp';

// ── چک کردن متغیرهای ضروری ───────────────────────────────────
if (!TARGET_HOST) {
  console.error('');
  console.error('❌ [ERROR] متغیر TARGET_HOST وارد نشده!');
  console.error('   داخل Dockfly → Variables → TARGET_HOST رو اضافه کن.');
  console.error('');
  process.exit(1);
}

// ── لاگ شروع ─────────────────────────────────────────────────
console.log('');
console.log('✅ [XHTTP+TLS Worker] Started');
console.log(`   PORT        : ${PORT}`);
console.log(`   TARGET      : https://${TARGET_HOST}:${TARGET_PORT}`);
console.log(`   RELAY_PATH  : ${RELAY_PATH}`);
console.log('');

// ── تابع proxy کردن request به سرور اصلی ─────────────────────
function forwardRequest(clientReq, clientRes) {
  const options = {
    hostname : TARGET_HOST,
    port     : TARGET_PORT,
    // همه path ها رو به سرور اصلی forward میکنه
    path     : clientReq.url,
    method   : clientReq.method,
    headers  : {
      ...clientReq.headers,
      host : TARGET_HOST,
    },
    // چون سرور اصلی TLS داره، rejectUnauthorized رو false میذاریم
    // تا اگه cert self-signed بود هم کار کنه
    rejectUnauthorized: false,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('[Forward error]', err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502);
      clientRes.end('Bad Gateway');
    }
  });

  clientReq.pipe(proxyReq, { end: true });
}

// ── HTTP Server (Dockfly بیرون TLS میده، داخل HTTP کافیه) ────
const server = http.createServer((clientReq, clientRes) => {
  forwardRequest(clientReq, clientRes);
});

server.listen(PORT, () => {
  console.log(`🚀 [XHTTP+TLS Worker] Listening on port ${PORT}`);
  console.log(`   ترافیک به https://${TARGET_HOST}:${TARGET_PORT}${RELAY_PATH} forward میشه`);
});
