## AssemblyVoting

Free and open source variant of an Assembly Voting and Agenda System.

## Deploy with docker-compose and traefik

## Development and Attribution

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### API

The API is written with serverless-mysql for React.

There are 4 Endpoints:
- agenda ( /add | /clear | /remove | /retrieve | /retrievecurrent )
  - add
  - clear
  - remove
  - retrieve
  - retrievecurrent
- speakers ( /add | /clear | /remove | /retrieve )
  - add
  - clear
  - remove
  - retrieve
- voting ( /addanalogue | /clear | /retrieve | /setnewactivevote | /stopactive)
  - addanalogue
  - clear
  - retrieve
  - setnewactivevote
  - stopactive
- settings ( /quotation )
  - quotation

Each Retrieve Endpoint returns a json.
There is one more endpoint to set up the database [/initdb]
