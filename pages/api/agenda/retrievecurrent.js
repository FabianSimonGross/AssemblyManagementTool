import { getToken } from 'next-auth/jwt'
import executeQuery from '../../../lib/db'

export default async function handler (req, res) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET
  })

  if (token) {
    try {
      await executeQuery({
        query: 'SELECT * FROM `agendaitems` WHERE `agendaitems`.`active`=1',
        values: null
      }).then(r => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'max-age=1')
        res.end(JSON.stringify(r))
      })
    } catch (error) {
      res.json(error)
      res.status(405).end()
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
