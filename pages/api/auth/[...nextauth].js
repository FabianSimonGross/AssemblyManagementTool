import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const ldap = require('ldapjs')

const options = {
  providers: [
    Credentials({
      name: 'LDAP',
      credentials: {
        username: {
          label: 'User',
          type: 'text',
          placeholder: ''
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      authorize: (credentials) => {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI
        })

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          const constUsername = process.env.LDAP_COMMONNAME + credentials.username + process.env.LDAP_ORGANIZATIONAL_ADRESS

          client.bind(constUsername, credentials.password, async (error) => {
            if (error) {
              console.error('Failed')
              reject(error)
            } else {
              console.log('Logged in')

              client.search(process.env.LDAP_ADMIN, { scope: 'base' }, function (error, res) {
                if (error) {
                  console.error('No Admin')
                }
                res.on('searchEntry', async (data) => {
                  resolve({
                    username: credentials.username,
                    password: credentials.password,
                    isAdmin: await data.object.uniqueMember.includes(constUsername)
                  })
                })
              })
            }
          })
        })
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      const isSignIn = !!user
      if (isSignIn) {
        token.username = user.username
        token.password = user.password
        token.isAdmin = user.isAdmin
      }
      return token
    },
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: { username: token.username, isAdmin: token.isAdmin }
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
