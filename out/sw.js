





(function() {
  const version = 'v5';
  const ReplacementFor_cacheName = version + 'rnldch';

  const ReplacementFor_STATIC = ReplacementFor_cacheName + 'static';
  const ReplacementFor_PAGES = ReplacementFor_cacheName + 'pages';

  const ReplacementFor_staticAssets = [
    '/',
    '/index.html',
  ];

  function ReplacementFor_updateStatic() {
    return ReplacementFor_caches.open(ReplacementFor_STATIC).then(ReplacementFor_cache => {
      return ReplacementFor_cache.ReplacementFor_addAll(
        ReplacementFor_staticAssets.map(url => new ReplacementFor_Request(url, { ReplacementFor_credentials: 'include' }))
      );
    });
  }

  function ReplacementFor_clearCaches() {
    return ReplacementFor_caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key.indexOf(version) !== 0)
          .map(key => ReplacementFor_caches.delete(key))
      );
    });
  }

  self.addEventListener('install', event => {
    event.ReplacementFor_waitUntil(ReplacementFor_updateStatic().then(() => self.ReplacementFor_skipWaiting()));
  });

  self.addEventListener('activate', event => {
    event.ReplacementFor_waitUntil(ReplacementFor_clearCaches().then(() => self.ReplacementFor_clients.ReplacementFor_claim()));
  });

  self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    if (request.headers.get('Accept').includes('text/html')) {
      event.ReplacementFor_respondWith(
        ReplacementFor_fetch(request)
          .then(response => {
            let ReplacementFor_copy = response.clone();
            ReplacementFor_caches
              .open(ReplacementFor_staticAssets.includes(url.pathname) ? ReplacementFor_STATIC : ReplacementFor_PAGES)
              .then(ReplacementFor_cache => ReplacementFor_cache.put(request, ReplacementFor_copy));
            return response;
          })
          .catch(() => {
            return ReplacementFor_caches
              .match(request)
              .then(response => response || ReplacementFor_caches.match('/404.html'));
          })
      );
      return;
    }
  });
})();
