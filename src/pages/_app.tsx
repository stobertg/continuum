import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { globalStyles, lightTheme, darkTheme } from '@theme'
import { SiteHeader, Footer } from '@components'
// import { SmoothScroll } from '@lib'
import '../theme/fonts/fonts.css'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => { globalStyles() }, [])

  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: lightTheme, dark: darkTheme }}
      defaultTheme={ lightTheme }
    > 
      <SiteHeader />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  )
}

export default MyApp