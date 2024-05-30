import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, {ReactNode} from 'react'

export const metadata: Metadata = {
  title: "Meet.io",
  description: "One place for all your meetings!",
  icons: {
    icon: '/icon/logo.svg'
  }
};

const RootLayout = ({children} : {children: ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout