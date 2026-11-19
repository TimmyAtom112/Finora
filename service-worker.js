const CACHE_NAME = "finora-v5";

const APP_FILES = [
"./",
"./index.html",
"./style.css?v=15",
"./script.js?v=14",
"./manifest.json",
"./Icon-192.png",
"./Icon-512.png"
];

self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME)
.then((cache) => cache.addAll(APP_FILES))
.then(() => self.skipWaiting())
);
});

self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys()
.then((cacheNames) =>
Promise.all(
cacheNames
.filter((name) => name !== CACHE_NAME)
.map((name) => caches.delete(name))
)
)
.then(() => self.clients.claim())
);
});

self.addEventListener("fetch", (event) => {
const request = event.request;

if (request.method !== "GET") return;

const url = new URL(request.url);

if (url.origin !== self.location.origin) return;

event.respondWith(
    fetch(request, { cache: "no-store" })
        .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
                const responseToCache = networkResponse.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, responseToCache));
            }

            return networkResponse;
        })
        .catch(() =>
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                if (request.mode === "navigate") {
                    return caches.match("./index.html");
                }

                return new Response("Offline", {
                    status: 503,
                    headers: {
                        "Content-Type": "text/plain"
                    }
                });
            })
        )
);

});