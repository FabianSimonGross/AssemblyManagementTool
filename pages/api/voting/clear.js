import executeQuery from '../../../lib/db'
import { getToken } from 'next-auth/jwt'

export default async function handler (req, res) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET
  })

  if (token.isAdmin) {
    try {
      await executeQuery({
        query: 'TRUNCATE motions',
        values: [req.body.title, req.body.yes, req.body.no, req.body.abstention]
      }).then(r => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'max-age=1')
        res.end(JSON.stringify(r))
      })
    } catch (error) {
      res.json(error)
      res.statusCode(405).end()
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
