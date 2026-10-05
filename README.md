# Oral Health Clinical Workstation

## Supabase setup

1. Copy `.env.example` to `.env` and set the Supabase project URL, anon key, and PostgreSQL connection string. Keep `.env` private; only the URL and anon key use the `VITE_` prefix.
2. Install dependencies with `npm ci`.
3. Apply the Drizzle migrations with `npm run db:migrate`. This creates the normalized clinical tables, Auth examiner profiles, owner-scoped row-level security policies, and the atomic clinical-record save function.
4. Create examiner accounts in Supabase Authentication. The database trigger creates each matching examiner profile automatically. Configure the project's allowed redirect URLs for the app origin to enable password resets.
5. Start the app with `npm run dev`.

Clinical record reads and writes use the signed-in Supabase session. Patient records are private to the examiner who created them. Unsaved drafts and display preferences remain in the browser's local storage.

The schema source lives in `oral-db-schema/db/schema`. Generate a schema migration after changing those files with `npm run db:generate`.
