# paletas-villaizan main repo

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `api`: a [NestJS](https://nestjs.com/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/db`: `prisma` configuration that is used by boyh `web` (generated types) and `api` (`Prisma Client`)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command:

```
cd paletas-villaizan
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd paletas-villaizan
npm run dev
```

## Important lessons learnt during development

### How to correctly setup an internal package

This StackOverflow post shows the correct way to establish an internal package that will be used by an app that doesnt automatically transpile its dependencies, like NestJS. Following said configuration, the package can be used both by Nextjs and NestJS, allowing the automatic generation and usage of types across the turborepo.

- [text](https://stackoverflow.com/a/75356810)

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
