import mysql from 'serverless-mysql'

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
})

export default async function executeQuery ({ query, values }) {
  if (values == null) {
    const results = await db.query(query)
    await db.end()
    return results
  }

  const results = await db.query(query, values)
  await db.end()
  return results
}

async function executeSqlQueryWithoutValues (sql) {
  await executeQuery({
    query: sql,
    values: null
  })
}

async function main () {
  await executeSqlQueryWithoutValues(
    'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`motions` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `yes` INT , `no` INT , `abstention` INT , `active` TINYINT(1), `title` TEXT NOT NULL, PRIMARY KEY (id))'
  )

  await executeSqlQueryWithoutValues(
    'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`speakers` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `name` TEXT NOT NULL, `gender` TEXT NOT NULL, PRIMARY KEY (id))'
  )

  await executeSqlQueryWithoutValues(
    'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`agendaitems` ( `id` INT NOT NULL AUTO_INCREMENT , `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `title` TEXT NOT NULL, `active` TINYINT(1), PRIMARY KEY (id))'
  )

  await executeSqlQueryWithoutValues(
    'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`settings` (`setting` TEXT NOT NULL, `bool` TINYINT(1))'
  )

  await executeSqlQueryWithoutValues(
    'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`voters` ( `user` VARCHAR(250) NOT NULL , `weight` INT NULL DEFAULT 0 , `voted` INT NULL DEFAULT 0 , `expires` TIMESTAMP NOT NULL , `loggedin` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`user`))'
  )

  await executeSqlQueryWithoutValues(
    'INSERT INTO ' + process.env.MYSQL_DATABASE + '.`settings`(`setting`, `bool`) VALUES (\'quotation\', 0)'
  )
}

main()
