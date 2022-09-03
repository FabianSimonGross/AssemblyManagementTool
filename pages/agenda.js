import { Card, Container, Navbar, Offcanvas } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Hamburger from 'hamburger-react'
import Link from 'next/link'

export default function Agenda () {
  /**
   * Managing Sessions
   */
  const { data: session, status } = useSession()

  /**
   * Managing of the Hamburger Menu
   */
  const [isOpen, setOpen] = useState(false)
  const handleToggle = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  /**
   * Retrieving Data for the Cards
   */
  const [agendaItems, setAgendaItems] = useState([])
  useEffect(() => {
    async function load () {
      const response = await fetch('/api/agenda/retrieve')
      const agendaItems = await response.json()
      setAgendaItems(agendaItems)
    }

    load().then()
  })

  return (
    <>
      <Head>
        <title>Assembly Management Tool</title>
        <meta name="description" content="Digital Voting for Assemblys by Neuland Ingolstadt"/>
        <link rel="icon" href='https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg'/>
      </Head>

      <Navbar bg="light" variant="light">
        <Container>
          <Link href="../">
            <Navbar.Brand>
              <img
                src='https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg'
                alt='Logo'
                className={`d-inline-block align-top ${styles.logo}`}
              />{' '}
              Assembly Management Tool
            </Navbar.Brand>
          </Link>
          <Hamburger toggled={isOpen} onToggle={setOpen}/>
        </Container>

        <Offcanvas show={isOpen} onHide={handleToggle} placement={'end'}>
          <Offcanvas.Body className={styles.navbar}>
            <>
              <li>
                <Hamburger toggled={isOpen} onToggle={setOpen}/>
              </li>
              <li>
                <Link href="../">
                  <h4>Dashboard</h4>
                </Link>
              </li>
              <li>
                <Link href="agenda">
                  <h4>Agenda</h4>
                </Link>
              </li>
              <li>
                <Link href="votinghistory">
                  <h4>Voting History</h4>
                </Link>
              </li>
              <li>
                <Link href="admin">
                  <h4>Administration</h4>
                </Link>
              </li>

              {!session &&
                <li>
                  <Link href="/api/auth/signin">
                    <a onClick={event => {
                      event.preventDefault()
                      signIn().then()
                    }}>
                      <h4>Sign In</h4>
                    </a>
                  </Link>
                </li>}

              {session &&
                <li>
                  <Link href="/api/auth/signout">
                    <a onClick={event => {
                      event.preventDefault()
                      signOut().then()
                    }}>
                      <h4>Sign Out</h4>
                    </a>
                  </Link>
                </li>}
            </>
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>

      {session &&
      <>
        <center>
          <h3 className={styles.title}>Agenda</h3>
        </center>

        {agendaItems.map((item, idx) => {
          return <Card className={styles.card} key={idx}>
                    <Card.Title>{item.title}</Card.Title>
                    {item.active > 0 && <Card.Subtitle>Active</Card.Subtitle>}
                    <Card.Body>

                    </Card.Body>
                  </Card>
        })}
      </>}
    </>
  )
}
