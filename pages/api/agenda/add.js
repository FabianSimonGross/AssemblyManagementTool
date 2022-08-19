import executeQuery from "../../../lib/db";

export default async function handler(req, res) {
  return new Promise(async (resolve) => {
    await executeQuery({
      query: 'INSERT INTO agendaitems(title) VALUES(?)',
      values: [req.body.title],
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=180000')
      res.end(JSON.stringify(r))
      resolve()
    }).catch(error => {
      res.json(error)
      res.statusCode(405).end()
      resolve()
    })
  })
}
