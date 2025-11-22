# Backend Microservices Suite

Small, independently deployable Node.js/Express services built for the FreeCodeCamp Backend Development and APIs certification. Each service exposes a clean JSON API and can be tested from a simple local dashboard.

## Tech Stack
- Node.js, Express
- MongoDB (URL shortener)
- Middleware-based routing, CORS

## Services
- **Browser-IP (whoami):** Returns the client IP, preferred language, and user-agent.
- **Timestamp:** Accepts date strings or Unix timestamps and returns Unix + UTC; supports “now” when no parameter is provided.
- **File metadata:** Accepts multipart/form-data uploads and responds with filename, MIME type, and size (processed in memory).
- **URL shortener:** Validates and stores URLs in MongoDB, generates a compact token, and redirects short URLs to the original destination.

## Architecture & Design
- Independent Express apps (one port per service) with their own middleware, health checks, and configuration via environment variables (ports, MongoDB URI).
- Shared patterns: centralized validation, consistent JSON error structures, and documented endpoints aligned with the FCC specs.

## Edge Cases & Robustness
- **Timestamp:** Tries Unix and ISO-8601 parsing; returns current time when no input; emits clear JSON errors for ambiguous input.
- **File uploads:** Validates presence, content type, and payload size; never writes to disk.
- **URL validation:** Rejects malformed/non-http(s) URLs and reuses existing mappings to avoid duplicates.
- **Whoami:** Falls back to the connection’s remote address if headers are missing; returns language and user-agent verbatim for debugging.

## Scaling & Enhancements
- Containerize each service and run behind an API gateway or ingress.
- Add analytics/logging for whoami/timestamp traffic.
- Harden the URL shortener with rate limits, quotas, and link expiration jobs.
- Extend the file metadata service into an upload gateway (e.g., temporary object storage).
