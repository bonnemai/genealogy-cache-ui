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

## Deploy with AWS Amplify Hosting

This is a Vite single-page application. Amplify should run the Vite build and publish the generated `dist` directory. The cache API is deployed separately; Amplify only hosts this frontend.

### Before deploying

1. Push this repository to GitHub, GitLab, Bitbucket, or another Git provider supported by Amplify.
2. Make sure the cache API is reachable over HTTPS and allows requests from the Amplify domain through CORS. The API must also validate authentication and ownership server-side; `x-owner-id` is only the current development identity and is not production authentication.
3. Plan the production API URL. The frontend reads it from `VITE_CACHE_API_URL`, for example `https://api.example.com`.

### Deploy from the Amplify console

1. Open the [AWS Amplify console](https://console.aws.amazon.com/amplify/) and choose **Create new app** → **Host web app**.
2. Connect the Git provider, repository, and branch to deploy. Allow Amplify to install the repository dependencies and create the build service role if prompted.
3. Confirm the build settings:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

   Amplify can usually detect these settings automatically, but keeping them in an `amplify.yml` file at the repository root makes deployments explicit and repeatable.

4. In **Hosting** → **Environment variables**, add `VITE_CACHE_API_URL` with the production API URL. Vite embeds variables beginning with `VITE_` into the browser bundle, so never put AWS access keys, Cognito client secrets, database credentials, or other secrets in this variable or any frontend environment variable.
5. Save and deploy. Every new commit pushed to the connected branch will trigger a new build and deployment.
6. Open the generated Amplify URL and verify that the dashboard loads and that the browser can call the API. Check the Amplify build logs if the build fails.

### Configure SPA routing

If client-side routes are added later, configure an Amplify rewrite so direct links resolve to `index.html`:

| Source address | Target | Type |
| --- | --- | --- |
| `/<*>` | `/index.html` | `200 (Rewrite)` |

The current UI does not define client-side routes, but this rule is useful before adding them.

### Add a domain and production settings

In the Amplify app, open **Hosting** → **Custom domains** to attach a domain and let Amplify provision the certificate. Add the resulting production origin to the cache API's CORS allowlist. Keep separate Amplify branches or apps for staging and production, with a different `VITE_CACHE_API_URL` for each environment.

Before calling this deployment production-ready, replace the development identity with Cognito sign-in, send the verified Cognito access token to the API, and confirm that the API enforces the user's access rights. The current UI is suitable for hosting, but its authentication flow is not production-ready yet.
