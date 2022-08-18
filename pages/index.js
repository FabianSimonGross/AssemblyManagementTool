import React, {useState} from 'react'
import Head from 'next/head'
import {Button, ButtonGroup, Card, Container, Form, Navbar, Offcanvas} from 'react-bootstrap'
import styles from '../styles/Home.module.css'

import Hamburger from 'hamburger-react'
import Link from "next/link";

export default function Home() {
  const [isOpen, setOpen] = useState(false)
  const handleToggle = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <Head>
        <title>AssemblyVoting</title>
        <meta name="description" content="Digital Voting for Assemblys by Neuland Ingolstadt"/>
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"/>
      </Head>

      <Navbar bg="light" variant="light">
        <Container>
          <Link href="../">
            <Navbar.Brand>
              <img
                src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
                alt="Studierendenvertretung TH Ingolstadt"
                className={`d-inline-block align-top ${styles.logo}`}
              />{' '}
              AssemblyVoting
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

              <li>
                <Form.Check
                  type="checkbox"
                  id="stay-logged-in"
                  label="Anwesend"
                  /**onChange*/
                />
              </li>
            </>
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>

      <>
        <Card className={styles.card}>
          <Card.Title>TOP 1: Beschlussfähigkeit</Card.Title>
          <Card.Subtitle>Current Agenda Item</Card.Subtitle>
          <Card.Body>

          </Card.Body>
          <Card.Footer>
            <Link href="agenda">
              <Button>
                Zur vollständigen Agenda
              </Button>
            </Link>
          </Card.Footer>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Speakers' List</Card.Title>
          <Card.Subtitle>Nicht quotiert</Card.Subtitle>
          <Card.Body>
            <ol>
              <li>Franz Zimmermann</li>
            </ol>
          </Card.Body>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Current Voting</Card.Title>
          <Card.Subtitle>Is there a current question?</Card.Subtitle>
          <Card.Body>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button>Ja</Button>
              <Button>Nein</Button>
              <Button>Enthaltung</Button>
            </ButtonGroup>
            <Button>Submit Vote</Button>
          </Card.Body>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Voting History</Card.Title>
          <Card.Body>
            <Card className={styles.card}>
              <Card.Title>Questiontitle</Card.Title>
              <Card.Body>
                8 JA | 9 NEIN | 5 Enthaltung
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </>

    </>
  )
}
