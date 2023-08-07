import SupabaseProvider from '@/providers/SupabaseProvider'
import './globals.css'
import { Barlow } from 'next/font/google'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import Navbar from '@/components/navbar/Navbar'
import getGenres from '@/actions/getGenres';
import ToasterProvider from '@/providers/ToasterProvider'
import getKeys from '@/actions/getKeys'
import Player from '@/components/player/Player'
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices'
import getCartItems from '@/actions/getCartItems'

const font = Barlow({ subsets: ['latin'], weight: ['100', '200' ,'300', '400', '500', '600', '700', '800'] })

export const metadata = {
  title: '7th Sky',
  description: 'Resonate on 7th Sky',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const genres = await getGenres();
  const keys = await getKeys();
  const products = await getActiveProductsWithPrices();
  const cartItems = await getCartItems();

  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/favicon.ico'/>
      </head>
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider genres={genres} keys={keys} products={products} cartItems={cartItems} />
            <Navbar />
            {children}
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
