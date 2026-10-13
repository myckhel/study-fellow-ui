import axios from 'axios'

/** Transport only. Features own endpoints, response validation and query keys.
 * No requests are made until a real backend contract is integrated.
 * VITE_* values are public; credentials must never go in frontend environment.
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})
