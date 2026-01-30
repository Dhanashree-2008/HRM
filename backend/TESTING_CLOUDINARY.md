# Testing Cloudinary Uploads (dev)

## Pre-requisites
- Set Cloudinary credentials in `backend/.env`:
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - CLOUDINARY_FOLDER (optional)

- Install dependencies: `cd backend && npm install`
- Start backend: `cd backend && npm run dev`

## Endpoints
- Upload profile (admin/manager):
  POST /api/admin/employees/:id/upload-profile
  Form field: `profile` (image)

- Upload resume (admin/manager):
  POST /api/admin/employees/:id/upload-resume
  Form field: `resume` (pdf/docx)

## Example curl

Upload profile:

curl -X POST http://localhost:5000/api/admin/employees/1/upload-profile \
  -F "profile=@/path/to/image.jpg" \
  -H "Authorization: Bearer <TOKEN>"

Upload resume:

curl -X POST http://localhost:5000/api/admin/employees/1/upload-resume \
  -F "resume=@/path/to/resume.pdf" \
  -H "Authorization: Bearer <TOKEN>"

Notes:
- Endpoints require an authenticated ADMIN or MANAGER by default.
- Responses include `profileImage` or `resumeUrl` with the Cloudinary secure URL on success.
