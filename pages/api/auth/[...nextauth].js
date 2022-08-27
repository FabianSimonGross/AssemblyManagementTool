import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
const ldap = require('ldapjs')

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'LDAP',
      credentials: {
        username: { label: 'DN', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials, req) {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp
        const client = ldap.createClient({
          url: process.env.LDAP_URI
        })

        // Essentially promisify the LDAPJS client.bind function
        return new Promise((resolve, reject) => {
          client.bind(credentials.username, credentials.password, (error) => {
            if (error) {
              console.error('Failed')
              console.error(error)
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
    async jwt ({ token, user }) {
      const isSignIn = !!user
      if (isSignIn) {
        token.username = user.username
        token.password = user.password
      }
      return token
    },
    async session ({ session, token }) {
      return { ...session, user: { username: token.username } }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET
  }
})
