This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

<br>

---

<br>

## Notes
> We use cryto to mask user's wishlistIds since they expose userId in it
```
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var text = 'I love kittens';

var cipher = crypto.createCipher(algorithm, key);  
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

assert.equal(decrypted, text);
```

<br>

---

<br>

## Useful Commands
```bash
> node_modules/.bin/firebase init emulators

> node_modules/.bin/firebase deploy --only hosting

> node_modules/.bin/firebase hosting:channel:deploy <CHANNEL_ID> --expires 2d

> node_modules/.bin/firebase hosting:channel:list

> node_modules/.bin/firebase hosting:channel:delete <CHANNEL_ID>

```

## Update to firebase.json
```json
{
  "hosting": {
    ...
    "redirects": [
      {
        "source": "/some/page",
        "destination": "/other/page",
        "type": "302", // "301"
      }
    ]
    ...
    "headers": [
      {
        "source": "/api.json",
        "headers": [{
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }]
      }
    ]
    ...
  },
}
```

## Preview Channels with GitHub Actions
1. Run this command which a wizard will ask questions
```bash
> node_modules/.bin/firebase init hosting:github
```

2. Commit changes to repository to allow it to run for future PRs
