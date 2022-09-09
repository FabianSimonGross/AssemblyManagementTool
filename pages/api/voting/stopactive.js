import executeQuery from '../../../lib/db'

export default async function handler (req, res) {
  try {
    await executeQuery({
      query: 'UPDATE motions SET motions.active = 0 WHERE motions.active=1',
      values: null
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=1')
      res.end(JSON.stringify(r))
    })

    await executeQuery({
      query: 'UPDATE voters SET voters.voted = voters.voted + 1'
    })
  } catch (error) {
    res.json(error)
    res.statusCode(405).end()
  }
}
