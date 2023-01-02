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
        query: 'UPDATE speakers SET speakers.active=0 WHERE speakers.active=1',
        values: null
      })
    } catch (error) {
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.setHeader('Content-Type', 'application/json')
  res.end()
}
