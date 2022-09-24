// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import executeQuery from '../../lib/db'

async function executeSqlQueryWithoutValues (sql, res) {
  await executeQuery({
    query: sql,
    values: null
  }).then(() => {
    res.statusCode = 200
    res.end()
  })
}

export default async function handler (req, res) {
  try {
    await executeSqlQueryWithoutValues(
      'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`motions` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `yes` INT , `no` INT , `abstention` INT , `active` TINYINT(1), `title` TEXT NOT NULL, PRIMARY KEY (id))',
      res
    )

    await executeSqlQueryWithoutValues(
      'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`speakers` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `name` TEXT NOT NULL, `gender` TEXT NOT NULL, PRIMARY KEY (id))',
      res
    )

    await executeSqlQueryWithoutValues(
      'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`agendaitems` ( `id` INT NOT NULL AUTO_INCREMENT , `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `title` TEXT NOT NULL, `active` TINYINT(1), PRIMARY KEY (id))',
      res
    )

    await executeSqlQueryWithoutValues(
      'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`settings` (`setting` TEXT NOT NULL, `bool` TINYINT(1))',
      res
    )

    await executeSqlQueryWithoutValues(
      'CREATE TABLE IF NOT EXISTS ' + process.env.MYSQL_DATABASE + '.`voters` ( `user` VARCHAR(250) NOT NULL , `weight` INT NULL DEFAULT NULL , `voted` INT NULL DEFAULT NULL , `expires` TIMESTAMP NOT NULL , `loggedin` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`user`))',
      res
    )

    await executeSqlQueryWithoutValues(
      'INSERT INTO ' + process.env.MYSQL_DATABASE + ".`settings`(`setting`, `bool`) VALUES ('quotation', 0)",
      res
    )
  } catch (error) {
    console.error(error)
  }
}
