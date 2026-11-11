# Genealogy Cache UI

This interface is the future user-facing dashboard for Genealogy Cache. It displays the archival documents already parsed for the signed-in user, their extraction status, source links, place, date, and parser version. Its purpose is transparency: users can see which records an agent reused rather than paying to analyse the same document again.

## Product direction

The cache itself is deliberately shared: once one person has parsed an archival URL, another person can reuse its structured result. The platform will later support multiple accounts with private search/access histories and private notes, while keeping approved archival extractions global. This UI currently uses a development identity and is not production authentication.

Production will use Cognito sign-in and send a verified access token to the cache API. An AccessLog table will let the UI show each signed-in user's own cache usage without revealing who first parsed a shared source. The API endpoint is configured through `VITE_CACHE_API_URL`; never put AWS secrets in frontend variables.

## Development

Requires Node.js 22+.

```sh
npm install
npm run build
npm test
```

Unit tests enforce 90% coverage for lines, statements, and functions, and 85% for branches. GitHub Actions runs the build and coverage-gated tests for every push and pull request.
