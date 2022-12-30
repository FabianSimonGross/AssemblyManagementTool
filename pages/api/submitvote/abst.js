import executeQuery from '../../../lib/db'
import { getToken } from 'next-auth/jwt'

export default async function handler (req, res) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET
  })

  if (token) {
    try {
      let isAbleToVote
      await executeQuery({
        query: 'SELECT * FROM voters WHERE voters.user=?',
        values: [token.username]
      }).then(r => {
        isAbleToVote = JSON.parse(JSON.stringify(r))
      })

      const weight = isAbleToVote[0].weight
      const voted = isAbleToVote[0].voted
      if (voted + 1 > weight) {
        res.status(401).end()
        return
      }

      await executeQuery({
        query: 'UPDATE motions SET motions.abstention = motions.abstention + 1 WHERE motions.active=1',
        values: null
      }).then(r => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'max-age=1')
        res.end(JSON.stringify(r))
      })

      await executeQuery({
        query: 'UPDATE voters SET voters.voted = voters.voted + 1 WHERE voters.user=?',
        values: [token.username]
      })
    } catch (error) {
      res.json(error)
      res.status(405).end()
    }
  } else {
    res.status(401)
  }
  res.end()
}
