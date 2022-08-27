import executeQuery from '../../../lib/db'

export default async function handler (req, res) {
  try {
    await executeQuery({
      query: 'TRUNCATE agendaitems',
      values: [req.body.title]
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=5')
      res.end(JSON.stringify(r))
    })
  } catch (error) {
    res.json(error)
    res.statusCode(405).end()
  }
}
