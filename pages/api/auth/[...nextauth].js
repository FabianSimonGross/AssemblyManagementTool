import Credentials from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
const ldap = require('ldapjs')

const options = {
  providers: [
    Credentials({
      name: 'LDAP',
      credentials: {
        username: { label: 'DN', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI
        })

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          client.bind(credentials.username, credentials.password, (error) => {
            if (error) {
              console.error('Failed')
              reject(error)
            } else {
              console.log('Logged in')
              resolve({
                username: credentials.username,
                password: credentials.password
              })
            }
          })
        })
      }
    })
  ],
  callbacks: {
    jwt: async (token, user) => {
      const isSignIn = !!user
      if (isSignIn) {
        token.username = user.username
        token.password = user.password
      }
      return token
    },
    session: async (session, user) => {
      return { ...session, user: { username: user.username } }
    }
  },
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_AUTH_SECRET,
    encryption: true
  }
}

export default (req, res) => NextAuth(req, res, options)
