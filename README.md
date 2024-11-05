Project for GovTech TAP assessment.

Hosted on https://scoreify-749378919199.asia-east1.run.app/. Next.js, Google Cloud Run, Fly Postgres.

The admin account has credentials

- username: administrator
- password: administrator

Only this account can clear all data (it's a button at the bottom of the page). Clear all data will also delete all previously created accounts except for the administrator account.

The SQL queries in actions.ts are parameterised and thus not vulnerable to injection. See https://www.youtube.com/watch?v=2Ggf45daK7k

[Lucia](https://lucia-auth.com/tutorials/username-and-password/nextjs-app) is used for authentication. Passwords are hashed using Argon2 before being stored.

Next.js provides CSRF protection out-of-the-box when using form actions, which are what we have used. Route handlers are not automatically protected, but we do not use any in this project.
