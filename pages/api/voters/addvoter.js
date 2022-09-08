import executeQuery from '../../../lib/db'
import { getToken } from 'next-auth/jwt'

export default async function handler (req, res) {
  // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET
  })

  if (token) {
    // Signed in
    const date = new Date(token.exp * 1000)
    await executeQuery({
      query: 'REPLACE INTO voters(user, expires) VALUES(?, ?)',
      values: [token.username, date]
    })
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
