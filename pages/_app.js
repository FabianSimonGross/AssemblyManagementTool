import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

function MyApp ({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
