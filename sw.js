// Service Worker: läuft im Hintergrund und speichert die Dateien der App im Browser,
// damit das Haushaltsbuch auch ohne Internet startet.

// Name des Speichers. Bei neuen Dateien in der Liste unten die Nummer erhöhen.
const CACHE_NAME = "haushaltsbuch-v1";

// Alle Dateien, die die App zum Starten braucht
const DATEIEN = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "lib/xlsx.full.min.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

// Beim Installieren: alle Dateien einmal herunterladen und speichern
self.addEventListener("install", (ereignis) => {
  ereignis.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(DATEIEN)));
  self.skipWaiting(); // neue Version sofort benutzen
});

// Beim Aktivieren: Speicher von alten Versionen löschen
self.addEventListener("activate", (ereignis) => {
  ereignis.waitUntil(
    caches
      .keys()
      .then((namen) =>
        Promise.all(namen.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
      )
      .then(() => self.clients.claim())
  );
});

// Bei jeder Anfrage: zuerst das Internet versuchen (damit Änderungen sofort ankommen),
// ohne Internet die gespeicherte Datei nehmen.
self.addEventListener("fetch", (ereignis) => {
  if (ereignis.request.method !== "GET") return;

  ereignis.respondWith(
    fetch(ereignis.request)
      .then((antwort) => {
        // Frische Antwort für das nächste Mal ohne Internet speichern
        const kopie = antwort.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(ereignis.request, kopie));
        return antwort;
      })
      .catch(() => caches.match(ereignis.request, { ignoreSearch: true }))
  );
});
