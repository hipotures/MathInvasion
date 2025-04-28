// Placeholder for Service Worker logic
// Using Workbox for caching strategies will be implemented in Milestone 6 (M6)

// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing.');
//   // event.waitUntil(caches.open(CACHE_NAME).then(...));
// });

// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activating.');
//   // event.waitUntil(clients.claim());
// });

// self.addEventListener('fetch', (event) => {
//   console.log('Fetching:', event.request.url);
//   // event.respondWith(caches.match(event.request).then(...));
// });

console.log(
  'Placeholder service-worker.ts loaded. Actual implementation pending.'
);

// Make TypeScript happy about 'self' being a ServiceWorkerGlobalScope
declare let self: ServiceWorkerGlobalScope;
export {}; // Ensure this file is treated as a module

interface ServiceWorkerGlobalScope {
  addEventListener(
    type: 'install',
    listener: (event: ExtendableEvent) => void
  ): void;
  addEventListener(
    type: 'activate',
    listener: (event: ExtendableEvent) => void
  ): void;
  addEventListener(type: 'fetch', listener: (event: FetchEvent) => void): void;
  // Add other ServiceWorkerGlobalScope properties/methods if needed
  // clients: Clients;
  // registration: ServiceWorkerRegistration;
  // etc.
}

interface ExtendableEvent extends Event {
  waitUntil(f: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  readonly request: Request;
  respondWith(response: Promise<Response> | Response): void;
}
