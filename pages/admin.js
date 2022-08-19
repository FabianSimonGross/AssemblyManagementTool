import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import {Button, Card, Container, Form, Navbar, Offcanvas} from 'react-bootstrap'
import styles from '../styles/Home.module.css'

import Hamburger from 'hamburger-react'
import Link from "next/link";

import AgendaCard from "../components/admin/AgendaCard";

export default function Admin() {
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
   * Retrieving Data for the Agenda Card
   */
  const [agendaItems, setAgendaItems] = useState([])
  useEffect(() => {
    async function load() {
      const response = await fetch('/api/agenda/retrieve');
      const agendaItems = await response.json();
      setAgendaItems(agendaItems)
    }
    load()
  })

  return (
    <>
      <Head>
        <title>AssemblyVoting</title>
        <meta name="description" content="Digital Voting for Assembly's by Neuland Ingolstadt"/>
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
        <AgendaCard pointsOfOrder={agendaItems}/>

        <Card className={styles.card}>
          <Card.Title>Voting Administration</Card.Title>
          <Card.Subtitle>Current Question in Green</Card.Subtitle>
          <Card.Body>
            <fieldset>
              <label htmlFor={"question"}>The Question:</label><br/>
              <input type={"text"} id={"question"} name={"question"}/>
            </fieldset>
          </Card.Body>
          <Card.Footer>
            <Button className={styles.button} variant={"outline-success"}>
              Start new Vote
            </Button>
            <Button className={styles.button} variant={"outline-warning"}>
              Restart Voting
            </Button>
            <Button className={styles.button} variant={"outline-danger"}>
              Stop Voting
            </Button>
            <Button className={styles.button} variant={"danger"}>
              Count Voting
            </Button>
          </Card.Footer>
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
          <Card.Footer>
            <form>
              <label htmlFor={"analogquestion"}>Question:</label><br/>
              <input type={"text"} id={"analogquestion"} name={"analogquestion"}/><br/>
              <label>Results:</label><br/>
              <input type={"text"} id={"yesresult"} name={"analogquestion"} placeholder={"YES: 6"}/><br/>
              <input type={"text"} id={"noresult"} name={"analogquestion"} placeholder={"NO: 6"}/><br/>
              <input type={"text"} id={"abstresult"} name={"analogquestion"} placeholder={"ABSTENTION: 6"}/><br/>
            </form>
            <br/>
            <Button className={styles.button} variant={"outline-success"}>
              Add Analog Voting
            </Button>
            <Button className={styles.button} variant={"danger"}>
              Clear Voting History
            </Button>
          </Card.Footer>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Speakers' List</Card.Title>
          <Card.Subtitle>Nicht quotiert</Card.Subtitle>
          <Card.Body>
            <ol>
              <li>
                <Form.Check
                  type="checkbox"
                  id="stay-logged-in"
                  label="Franz Zimmermann"
                  /**onChange*/
                />
              </li>
            </ol>
          </Card.Body>
          <Card.Footer>
            <form>
              <label htmlFor={"speakername"}>Speaker:</label><br/>
              <input type={"text"} id={"speakername"} name={"speakername"}/><br/>

              <input type={"radio"} id={"men"} name={"gender"}/>
              <label htmlFor={"men"}> Men</label><br/>

              <input type={"radio"} id={"women"} name={"gender"}/>
              <label htmlFor={"women"}> Women</label> <br/>

              <input type={"radio"} id={"diverse"} name={"gender"}/>
              <label htmlFor={"diverse"}> Diverse</label> <br/>
            </form>
            <br/>
            <Button className={styles.button} variant={"outline-success"}>
              Add Speaker
            </Button>
            <Button className={styles.button} variant={"outline-warning"}>
              Activate quotation
            </Button>
            <Button className={styles.button} variant={"outline-danger"}>
              Remove Speakers
            </Button>
            <Button className={styles.button} variant={"danger"}>
              Clear Speakers' List
            </Button>
          </Card.Footer>
        </Card>
      </>

    </>
  )
}
