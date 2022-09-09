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
    } catch (error) {
    }
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
