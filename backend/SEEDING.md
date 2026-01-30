# Seeding the database (sample data)

This project includes a convenience seed script to insert sample data (admin, a manager, and a few employees) for local development.

How to run

1. Ensure your `.env` is configured (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT if needed).
2. Run the seed script:

   cd backend
   npm run seed

   You can pass `--yes` to skip the confirmation prompt:

   npm run seed -- --yes

Default accounts created

- Admin: **admin@litehr.com** / **123456** (role: ADMIN)
- Manager: **manager1@litehr.com** / **123456** (role: MANAGER)
- Employees: **alice@litehr.com**, **bob@litehr.com**, **carla@litehr.com** (all with password `123456`)

Notes

- The script uses `findOrCreate` so running it multiple times will not create duplicate users.
- This is for local/dev use only — remove or protect seed scripts before using in production.