import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
        const client = ldap.createClient({
          url: process.env.LDAP_URI
        })

        return new Promise((resolve, reject) => {
          client.bind(credentials.username, credentials.password, (error) => {
            if (error) {
              console.error('Failed')
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
