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
      authorize: (credentials) => {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI
        })

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          const username = process.env.LDAP_COMMONNAME + credentials.username + process.env.LDAP_ORGANIZATIONAL_ADRESS
          console.log(username)

          client.bind(username, credentials.password, (error) => {
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
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      return token
    },
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: { username: token.username }
      }
    }
  },
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_AUTH_SECRET,
    maxAge: 60 * 60 * 6,
    encryption: true
  },
  session: {
    maxAge: 60 * 60 * 6
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#005a9b',
    logo: 'https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg'
  }
}

export default (req, res) => NextAuth(req, res, options)
