
Start application:
node --env-file=config.env server


Run Migration:
npx sequelize db:migrate
Hint: Delete sequilize table on DB (and possibly the table itself). Manually update Migration file.


Create Migration from a Model:
npx sequelize-cli migration:generate --name [name of the Model]



Creation of table on database:
- Naming must use singular to the modal em plural to the table.

Production:
Use
npm install --omit=dev