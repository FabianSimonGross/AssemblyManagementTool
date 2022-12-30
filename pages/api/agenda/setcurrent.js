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
