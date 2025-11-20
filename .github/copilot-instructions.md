## Quick notes for AI coding agents

This repository is a multi-service Node/Express monorepo built as separate microservices (folders like `api-gateway/`, `auth-service/`, `questionnaire-service/`, `user-service/`, etc.). Each service is an independent Express app with its own `package.json`, `Dockerfile` and `config/`.

Key patterns and where to look
- API gateway: `api-gateway/src/index.js` — exposes versioned routes under `/api/:version/*`, serves Swagger at `/api-docs`, and enforces auth+rate limiting. Use this file to understand public entrypoints.
- Controllers: `*/src/interfaces/controllers/*.js` extend `Controller` (see `questionnaire-service/src/interfaces/controllers/Controller.js`) and rely on `sendResponse` / `sendError` shape `{ success, message, data? }`.
- Use Cases: application logic lives under `*/src/application/use_cases/*`. Use cases are constructed with repository instances (dependency injection). Example: `QuestionnaireController` creates `new CreateQuestionnaireUseCase({ questionnaireRepo: this.repo, ... })`.
- Repositories & Models: DB access is via `*/src/services/repositories/*` which extend `BaseRepository` (`BaseRepository.js`) and use Mongoose models in `*/src/services/models/*`. Pagination and filtering use `src/utils/paginationHelper.js`.
- Translations / validations: Services use `i18next` and expose translation via `req.t('messages.*')`. Check `*/src/locales/en.json` and `es.json` for keys and labels used across controllers.

Running and debugging
- Local compose: root `docker-compose.yml` can start the full stack (services, DBs). Use the service-level Dockerfiles for container builds.
- Single service dev: cd into a service folder (e.g., `questionnaire-service`), `npm install`, then `npm run dev` (nodemon) or `npm start` to run `./bin/www`.
- DB: services use Mongoose; check `config/database.js` inside each service for `MONGO_URI` and connection behavior. Tests or local runs typically expect a local Mongo at `mongodb://localhost:27017/app` unless env overrides are provided.

Project-specific conventions (important to follow)
- Versioned routing: assume controllers are mounted under `/api/:version/...`. Avoid hard-coding API versions in controller-level logic; rely on gateway routing.
- Response contract: always return the enveloped response from `Controller.sendResponse()` or `sendError()` (do not return raw objects directly from controllers).
- i18n keys: controllers use `req.t("messages.*")` for user-facing messages; when adding keys, add to each service's `src/locales/*.json`.
- Model translations: Mongoose schemas use Map types for translations (see `QuestionnaireModel.js`), so code should treat translations as JS Maps/objects accordingly.
- Use cases are authoritative: prefer modifying/adding business rules in `src/application/use_cases/*` rather than in controllers or repositories.

Integration points & external deps
- Services communicate via the API Gateway — look at `api-gateway/src/routes/proxyRoutes.js` to see how requests are proxied between services.
- Swagger: `api-gateway/swagger/swagger.json` contains the API contract; update it when adding/changing public endpoints.
- Auth: `auth-service` handles authentication; tokens and middleware are used by the gateway (see `api-gateway/src/middlewares/auth.js`).

Examples (copyable patterns)
- Creating a use case in a controller (see `questionnaire-service/src/interfaces/controllers/QuestionnaireController.js`):
  - instantiate repos in controller constructor: `this.repo = new QuestionnaireRepository()`
  - create use case: `new CreateQuestionnaireUseCase({ questionnaireRepo: this.repo, ... })`
  - always wrap controller handlers with try/catch and use `this.sendResponse` or `this.sendError`.

When to open a PR vs a patch
- Small fixes (typos, small validation fixes, docs) — open a PR against `main` with a concise description. For behavioral changes touching multiple services (auth, gateway, service API), include integration notes and updated swagger.

Files to reference when coding or reviewing
- `api-gateway/src/index.js` (entry / routing / swagger)
- `*/src/interfaces/controllers/Controller.js` (response shape)
- `*/src/application/use_cases/` (business rules)
- `*/src/services/repositories/BaseRepository.js` and `*/src/utils/paginationHelper.js` (DB patterns)
- `*/src/locales/*.json` (i18n keys)

If anything here is unclear or you want examples for a specific service, say which service and which kind of change you need and I will expand this file with concrete snippets and checklist items.
