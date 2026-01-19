# Local smoke tests (backend + CV summarizer)

## 1) Start backend

1. cd backend
2. npm install
3. Create a `.env` with your DB credentials (or use a local MySQL) and optionally `JWT_SECRET` and `GEMINI_API_KEY`.
4. npm run dev

## 2) Health check

curl http://localhost:5000/api/health

Expected: { "status": "ok", "message": "LiteHR backend running" }

## 3) Test Gemini endpoint (simulated)

curl http://localhost:5000/api/cv/test/gemini

Returns a JSON object with `success` boolean and `response` or `error`.

## 4) Summarize from text (no auth required in dev)

curl -X POST http://localhost:5000/api/cv/summarize/text \
  -H "Content-Type: application/json" \
  -d '{"text":"This candidate has 5 years experience in React and Node.js...","jobPosition":"Frontend Developer"}'

Expected: { "success": true, "summary": "...", "metadata": {...} }

## 5) Summarize from URL (no auth required in dev)

curl -X POST http://localhost:5000/api/cv/summarize/url \
  -H "Content-Type: application/json" \
  -d '{"cvUrl":"https://example.com/mycv.pdf","jobPosition":"Backend Developer"}'

## 6) Summarize from file upload

curl -X POST http://localhost:5000/api/cv/summarize/upload \
  -F "cv=@/path/to/file.pdf" \
  -F "jobPosition=Frontend" \
  -F "applicationId=123"

Expected: JSON with `success: true` and `summary`.

---

Notes:
- Summarization endpoints are simulated placeholders for development; replace service logic with real text extraction + LLM calls in production.
- Summarize endpoints intentionally **do not require auth** in this dev branch to make local testing easier.

## Dashboard API smoke tests (ADMIN)

1) Obtain a token (use an ADMIN account):

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

Copy the returned `token` from the response.

2) GET admin dashboard summary:

curl -H "Authorization: Bearer <token>" http://localhost:5000/api/dashboard/admin

Expected JSON: {
  "totalEmployees": 123,
  "totalActiveUsers": 110,
  "presentToday": 95,
  "onLeaveToday": 3,
  "pendingLeaves": 2,
  "avgPerformance": 3.75,
  "recentWorklogs": [ ... ]
}

3) GET admin charts (monthly attendance, monthly leaves, departments):

curl -H "Authorization: Bearer <token>" http://localhost:5000/api/dashboard/charts/admin

Expected JSON: {
  "attendance": [ { "month": 1, "count": 95 }, ... ],
  "leaves": [ { "month": 1, "count": 12 }, ... ],
  "departments": [ { "department": "IT", "count": 35 }, ... ]
}

Notes:
- The `month` field is numeric (1-12). Values are normalized to numbers so frontend should not need to parse strings.
- If any endpoint returns 401/403 ensure the token belongs to an ADMIN user and that the Authorization header is present.

