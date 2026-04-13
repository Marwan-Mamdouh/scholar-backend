/**
 * Vercel Express entry: the framework expects `index.js` here. The real app lives in
 * `src/index.js`; after `npm run build`, that compiles to `dist/src/index.js`.
 * Local dev: `npm run dev` (tsx loads `src/index.js` directly).
 */
export { default } from "./dist/src/index.js";
