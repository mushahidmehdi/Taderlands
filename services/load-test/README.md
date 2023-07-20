## Migrate Database

* Make sure you created `.env` file next to `package.json`
```env
PG_DATABASE=shuffly
PG_HOST=127.0.0.1
PG_USER=user
PG_PASS=pass
PG_PORT=5432
```

empty project

* Execute following code to init tables
```shell
npx env-cmd sequelize db:migrate
```