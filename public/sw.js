if(!self.define){let e,s={};const t=(t,a)=>(t=new URL(t+".js",a).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const r=e=>t(e,n),o={module:{uri:n},exports:c,require:r};s[n]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"d554de04e11f8c1678be91e0107681a5"},{url:"/_next/static/WD0ZRN1EpMkJELU3pksNA/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/WD0ZRN1EpMkJELU3pksNA/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/131c4705-5d189cd93088c0df.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/13b76428-27b42a5e9034598d.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/144-468186c2a24094b3.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/23-a4c0672cd88afe29.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/441-86949caeb435f83e.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/487-6d9f93eee877c08b.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/555-2124f8b78d5ae590.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/602-85290c365be1b56f.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/607-6516dae0f67a2e0a.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/7-c8dccc91d8262565.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/706-656e99a63b0ae5bd.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/77-eeff73db575deeee.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/864-aa7801890af70f27.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/959-787b2504783b5165.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/973-f6e959e83a5fd3bd.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/998-88b93579c8508b75.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/a6eb9415-1ed4bc4c73dc0c69.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/_not-found/page-553ea2e5621f0ff6.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/dashboard/clientes/%5Baction%5D/page-b3f90a71bee8c796.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/dashboard/clientes/page-21f1767f5a81ef20.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/dashboard/layout-a92975abb2fc1d50.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/dashboard/page-a4d285431a4f38c6.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/layout-a1a29e7ecd71b2ff.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/login/layout-a3f05e5511881877.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/login/page-0a047f33f45e485e.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/logout/page-a01bdbea9db3a0fd.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/app/page-782af43f87a09f03.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/e8686b1f-9003f6cbb82cfcb0.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/fc24d37f-abf2cd0bf497cdf8.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/fd9d1056-356160cbde400377.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/main-9ee24a36dfec472e.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/main-app-bb1a4415dca3d052.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-0c2bc03985defd2b.js",revision:"WD0ZRN1EpMkJELU3pksNA"},{url:"/_next/static/css/26c9ee81018136f2.css",revision:"26c9ee81018136f2"},{url:"/_next/static/css/36ea806cd4cf56d6.css",revision:"36ea806cd4cf56d6"},{url:"/_next/static/css/56e6cac8c4345e9a.css",revision:"56e6cac8c4345e9a"},{url:"/_next/static/css/92e8aaa217178544.css",revision:"92e8aaa217178544"},{url:"/_next/static/css/b7262ac6e58186ae.css",revision:"b7262ac6e58186ae"},{url:"/_next/static/css/bc06a968d63a9a3e.css",revision:"bc06a968d63a9a3e"},{url:"/_next/static/css/bcefb1103594994c.css",revision:"bcefb1103594994c"},{url:"/_next/static/media/primeicons.19e14e48.svg",revision:"19e14e48"},{url:"/_next/static/media/primeicons.310a7310.ttf",revision:"310a7310"},{url:"/_next/static/media/primeicons.7f772274.woff",revision:"7f772274"},{url:"/_next/static/media/primeicons.8ca441e1.eot",revision:"8ca441e1"},{url:"/_next/static/media/primeicons.e1a53edb.woff2",revision:"e1a53edb"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-500.4ce80207.woff",revision:"4ce80207"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-500.de270e01.woff2",revision:"de270e01"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-700.c5993c4d.woff",revision:"c5993c4d"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-700.fea1ca24.woff2",revision:"fea1ca24"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-regular.5c59b247.woff2",revision:"5c59b247"},{url:"/_next/static/media/roboto-v20-latin-ext_latin-regular.c9064c1a.woff",revision:"c9064c1a"},{url:"/manifest.json",revision:"2fe5afce94064bf39798a7fb2497bec9"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
