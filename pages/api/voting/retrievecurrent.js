import executeQuery from '../../../lib/db'

export default async function handler (req, res) {
  try {
    await executeQuery({
      query: 'SELECT * FROM `motions` WHERE motions.active = 1;',
      values: null
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=0')
      res.end(JSON.stringify(r))
    })
  } catch (error) {
    res.json(error)
    res.statusCode(405).end()
  }
}
