# Prompt Store Admin setup

Admin URL: `https://www.textcase.in/prompt-admin`

This is integrated into the existing TextCase project. The admin page is rendered without the public Navbar/Footer and is marked `noindex,nofollow,noarchive`.

## Supabase
You already have `supabase/prompt_store.sql`. Do not run it again if it was already executed.

Run only `supabase/prompt_store_admin.sql`.

Then create an admin user in Supabase Authentication and authorize that user:

```sql
insert into public.prompt_admins (user_id)
select id from auth.users
where email = 'YOUR_ADMIN_EMAIL';
```

The browser uses the existing TextCase Supabase client. Do NOT add a service-role/secret key to frontend environment variables.

## What admin can manage
- Categories
- Category SEO title/description
- Prompts
- Prompt slug/tags/use case
- Sort order
- Publish/draft
- Search/filter
- Dashboard counts

The public Prompt Store remains available at `/prompt-store`.
