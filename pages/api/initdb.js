// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import excuteQuery from "../../lib/db";

export default async function handler(req, res) {

  return new Promise(async () =>{
    await excuteQuery({
      query: "CREATE TABLE IF NOT EXISTS `voting`.`history` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `yes` INT NOT NULL , `no` INT NOT NULL , `abstention` INT NOT NULL , `title` TEXT NOT NULL, PRIMARY KEY (id))",
      values: null
    }).then(() => {
      res.statusCode = 200
      res.end()
    })

    await excuteQuery({
      query: "CREATE TABLE IF NOT EXISTS `voting`.`currentmotion` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `yes` INT NOT NULL , `no` INT NOT NULL , `abstention` INT NOT NULL , `title` TEXT NOT NULL, PRIMARY KEY (id) )",
      values: null
    }).then(() => {
      res.statusCode = 200
      res.end()
    })

    await excuteQuery({
      query: "CREATE TABLE IF NOT EXISTS `voting`.`speakers` ( `id` INT NOT NULL AUTO_INCREMENT, `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `name` TEXT NOT NULL, PRIMARY KEY (id) )",
      values: null
    }).then(() => {
      res.statusCode = 200
      res.end()
    })

    await excuteQuery({
      query: "CREATE TABLE IF NOT EXISTS `voting`.`agendaitems` ( `id` INT NOT NULL AUTO_INCREMENT , `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `title` TEXT NOT NULL, PRIMARY KEY (id))",
      values: null
    }).then(() => {
      res.statusCode = 200
      res.end()
      }
    )
  })
}
