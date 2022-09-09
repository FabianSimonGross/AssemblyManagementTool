import executeQuery from '../../../lib/db'
import { getToken } from 'next-auth/jwt'

export default async function handler (req, res) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET
  })

  if (token.isAdmin) {
    // Signed in
    await executeQuery({
      query: 'UPDATE voters SET weight = ? WHERE user = ?',
      values: [req.body.weight, req.body.user]
    }).then(() => {
      res.statusCode = 200
    })
  } else {
    // Not Signed in
    res.status(401)
  }
  res.setHeader('Content-Type', 'application/json')
  res.end()
}
