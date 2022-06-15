import Head from 'next/head'
import Calculator from './calculator'
import styles from '../styles/Home.module.css'

export default function Home() {
  
  return (

    <div className={styles.container}>

      <Head>
        <title>Calculator</title>
        <meta name="description" content="A simple calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Calculator/>
      </main>

    </div>

  )
  
}