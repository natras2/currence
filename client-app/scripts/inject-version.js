const fs = require('fs');
const path = require('path');

// Genera un timestamp univoco per questa build
const buildVersion = Date.now().toString();

// Percorso del service worker
const serviceWorkerPath = path.join(__dirname, '../public/service_worker.js');

// Leggi il file
let content = fs.readFileSync(serviceWorkerPath, 'utf8');

// Sostituisci il placeholder con la versione reale
content = content.replace('__BUILD_VERSION__', buildVersion);

// Sovrascrivi il file
fs.writeFileSync(serviceWorkerPath, content);

console.log(`✅ Service Worker version injected: ${buildVersion}`);