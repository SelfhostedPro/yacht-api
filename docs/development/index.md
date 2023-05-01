# Development

## Technologies
| Technology  | Description                          | Links           |
| ----------- | ------------------------------------ |-----------------|
| Typescript  | :octicons-code-24:    Language       | [:octicons-file-24: docs](https://www.typescriptlang.org/docs/)
| NestJS      | :octicons-server-24: Backend         | [:octicons-file-24: docs](https://docs.nestjs.com/)
| VueJS 3     | :octicons-globe-24:     Frontend     | [:octicons-file-24: docs](https://vuejs.org/guide/introduction.html)
| pnpm        | :octicons-package-24:     Packages   | [:octicons-file-24: docs](https://pnpm.io/installation)


## Structure
Yacht is developed in a monorepo structure in order to allow for development to all take place in one repo and simplify building and sharing resources. Since Yacht is developed in typescript the frontend and the backend can easily share resources. The following is the structure of the repo:

```
├── root # Used for s6supervisor for bootstrapping and service management
├── server # NestJS backend API
├── types # Interfaces used by frontend and backend
└── ui # VueJS Frontend
```

## Running Locally
All development should be done on your own fork of yacht and submitted via a PR. If you're not familiar with how to do this, there's a good article [here](https://dev.to/codesphere/how-to-start-contributing-to-open-source-projects-on-github-534n).

**NodeJS 18 is required in order to develop. Please follow [official documentation](https://nodejs.org/en/download) to install it and then get started.**

Once cloned, install all the dependencies:
```bash
npm install -g pnpm # may require sudo
pnpm -r i
```

Once all the dependencies are installed you can use the following commands to run locally:
```bash
pnpm --filter @yacht/server run start:dev # Backend - runs on 0.0.0.0:3000
pnpm --filter @yacht/ui run dev # Frontend - runs on 0.0.0.0:5000
```

For development, the frontend will proxy requests to /api to the backend in order for easy development. When built and running in docker, the backend will serve the frontend for all urls except for /api in order to allow for a single process to run the entire application.