import executeQuery from "../../../lib/db";

export default function handler (req, res) {
  return new Promise(async (resolve) => {
    await executeQuery({
      query: 'INSERT INTO motions(title, yes, no, abstention) VALUES(?,?,?,?)',
      values: [req.body.title, req.body.yes, req.body.no, req.body.abstention],
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=1')
      res.end(JSON.stringify(r))
      resolve()
    }).catch(error => {
      res.json(error)
      res.statusCode(405).end()
      resolve()
    })
  })
}
