import executeQuery from "../../../lib/db";

export default function handler (req, res) {
  return new Promise(async (resolve) => {
    await executeQuery({
      query: 'UPDATE agendaitems SET agendaitems.active=0 WHERE agendaitems.active=1',
      values: null
    })

    await executeQuery({
      query: 'UPDATE agendaitems SET agendaitems.active=1 WHERE agendaitems.title=?',
      values: [req.body.title]
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
