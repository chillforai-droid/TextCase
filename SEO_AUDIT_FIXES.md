# TextCase Fixes Applied

- Improved hero H1 contrast for dark mode (`dark:text-white`).
- Escaped user text before inserting it into exported HTML and Word-compatible HTML documents.
- Revoked generated object URLs after downloads to reduce browser memory leaks.
- Updated the Word export label to accurately say `Word-compatible Document (.doc)`.
- Replaced the unverified static `< 5 ms` scanner metric with `Local & Private`.

## Verification

- Static source checks completed.
- Full `npm ci` / production build could not be completed in the execution environment because dependency installation timed out.
- Run `npm ci`, `npm run lint`, and `npm run build` locally or in Vercel Preview before production deployment.
