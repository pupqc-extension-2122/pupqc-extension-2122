# BSIT 4-1 2021-2022 OJT PUPQC EXTENSION OFFICE

## NPM Scripts

* To run, `npm run {script}`

|Script| Desription               |
|------|--------------------------|
`start`|start server with nodejs 
`dev`|start server with nodemon
`db_create`|create database from .env
`db_drop`|drop database from .env
`db_migrate_up`|run all unapplied migrations
`db_migrate_down`|undo all migrations
`db_seed_up`|run all unapplied seeds
`db_seed_down`|undo all seeds
`db_migrate`|undo then apply all migrations
`db_seed`|undo then apply all seeds
`db_redo`|drop db, create db, run migrations, run seeds