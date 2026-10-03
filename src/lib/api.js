/**
 * API base URL — reads VITE_API_URL from environment at build time.
 *
 * Local dev:   Vite proxies /api → http://localhost:5000, so any relative
 *              /api/... call works. We still export the full URL so fetch()
 *              calls work the same way in both dev and production.
 *
 * Production:  Set VITE_API_URL=https://your-backend.onrender.com/api in
 *              Vercel's environment variables before deploying.
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
