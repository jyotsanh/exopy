/**
 * Test environment variables.
 *
 * `src/config/env.ts` validates `process.env` at import time with Zod and
 * calls `process.exit(1)` if anything is missing. This file runs before any
 * module is imported (see `setupFiles` in jest.config.ts) so the validation
 * always sees a fully-populated env.
 */

process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.MONGO_URI = "mongodb://localhost:27017/test-not-used";
process.env.JWT_SECRET = "test-jwt-secret-at-least-10-chars";
process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret-at-least-10-chars";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:3000/api/auth/google/callback";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.SUPERADMIN_EMAIL = "test@example.com";
process.env.SUPERADMIN_PASSWORD = "test-pass";
process.env.SUPERADMIN_USERNAME = "test-admin";
