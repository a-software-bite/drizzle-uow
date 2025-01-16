A Unit of Work implementation with Drizzle ORM
===============================================

# Running the examples

> Note: Create a `.env` file off of the `.env.example` file with the preferred settings.
    This is used both by the application code and the database container.

After installing the project(`npm run install`), spin up the database container:

```
docker compose -f docker/docker-compose.dev.yaml --env-file .env up
```

> Note, remove the volume to have a clean database if needed:
    `docker compose -f docker/docker-compose.dev.yaml --env-file .env down -v`

Finally, run the examples. For instance:

```
npx dotenvx run -- tsx src/examples/account_and_toy_success_flow.ts
```

or using the **npm** script:

```
npm run example:happy-path
```
