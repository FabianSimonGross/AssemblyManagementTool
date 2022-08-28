import { Button, ButtonGroup, Card, Container, Navbar, Offcanvas } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Hamburger from 'hamburger-react'
import HistoryCard from '../components/voting/HistoryCard'
import Link from 'next/link'
import axios from 'axios'

async function onYesSubmit () {
  axios.post('/api/submitvote/yes')
    .then(() => {
      console.info('YES_VOTE')
    })
    .catch((e) => {
      console.error(e)
    })
}

async function onNoSubmit () {
  axios.post('/api/submitvote/no')
    .then(() => {
      console.info('NO_VOTE')
    })
    .catch((e) => {
      console.error(e)
    })
}

async function onAbstSubmit () {
  axios.post('/api/submitvote/abst')
    .then(() => {
      console.info('ABST_VOTE')
    })
    .catch((e) => {
      console.error(e)
    })
}

export default function Home () {
  const session = true

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
  const [refreshToken, setRefreshToken] = useState(Math.random())
  const [motionItems, setMotionsItems] = useState([])
  const [currentMotion, setCurrentAgendaItem] = useState([])
  const [agendaItems, setAgendaItems] = useState([])
  const [speakersItems, setSpeakersItems] = useState([])
  const [isQuotation, setQuotation] = useState(false)
  useEffect(() => {
    async function load () {
      const motionResponse = await fetch('/api/voting/retrieve')
      const motionItems = await motionResponse.json()
      setMotionsItems(motionItems)

      const currentMotionResponse = await fetch('/api/voting/retrievecurrent')
      const currentMotionItem = await currentMotionResponse.json()
      setCurrentAgendaItem(currentMotionItem)

      const agendaResponse = await fetch('/api/agenda/retrievecurrent')
      const agendaItems = await agendaResponse.json()
      setAgendaItems(agendaItems)

      const speakersResponse = await fetch('/api/speakers/retrieve')
      const speakersItems = await speakersResponse.json()
      setSpeakersItems(speakersItems)

      const quotationResponse = await fetch('/api/settings/retrievequotation')
      const quotation = await quotationResponse.json()
      if (quotation[0].bool !== 0) {
        setQuotation(true)
      } else {
        setQuotation(false)
      }
    }

    load().then(setTimeout(() => setRefreshToken(Math.random()), 5000))
  }, [refreshToken])

  console.log(session)

  return (
    <>
      <Head>
        <title>Assembly Management Tool</title>
        <meta name="description" content="Digital Voting for Assemblys by Neuland Ingolstadt"/>
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"/>
      </Head>

      <Navbar bg="light" variant="light">
        <Container>
          <Link href="../">
            <Navbar.Brand>
              <Image
                src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
                alt="Studierendenvertretung TH Ingolstadt"
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
        <Card className={styles.card}>
          {agendaItems.map((item, idx) => {
            return <Card.Title key={idx}>{item.title}</Card.Title>
          })}

          {agendaItems.length < 1 && <Card.Title>NO CURRENT AGENDA ITEM</Card.Title>}
          <Card.Subtitle>Current Agenda Item</Card.Subtitle>
          <Card.Body>

          </Card.Body>
          <Card.Footer>
            <Link href="agenda">
              <Button>
                To the Agenda
              </Button>
            </Link>
          </Card.Footer>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Speakers&rsquo; List</Card.Title>
          {!isQuotation && <Card.Subtitle>Not quoted</Card.Subtitle>}
          {isQuotation && <Card.Subtitle>Quoted</Card.Subtitle>}
          <Card.Body>
            {!isQuotation && <ol>
              {speakersItems.map((item, idx) => {
                return <li key={idx}>{item.name + ' | ' + item.gender}</li>
              }
              )}
            </ol>}

            {isQuotation && <>
              <h6>Men</h6>
              <ol>
                {speakersItems.map((item, idx) => {
                  if (item.gender === 'm') {
                    return <li key={idx}>{item.name + ' | ' + item.gender}</li>
                  }
                  return null
                })
                }
              </ol>
            </>
            }

            {isQuotation && <>
              <h6>Women</h6>
              <ol>
                {speakersItems.map((item, idx) => {
                  if (item.gender === 'w') {
                    return <li key={idx}>{item.name + ' | ' + item.gender}</li>
                  }
                  return null
                })
                }
              </ol>
            </>
            }

            {isQuotation && <>
              <h6>Diverse</h6>
              <ol>
                {speakersItems.map((item, idx) => {
                  if (item.gender === 'd') {
                    return <li key={idx}>{item.name + ' | ' + item.gender}</li>
                  }
                  return null
                })
                }
              </ol>
            </>
            }
          </Card.Body>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Current Voting</Card.Title>
          {currentMotion.length > 0 && currentMotion.map((item, idx) => {
            return <Card.Subtitle key={idx}>{item.title}</Card.Subtitle>
          })}

          {currentMotion.length < 1 && <Card.Subtitle>No Active Question</Card.Subtitle>}
          <Card.Body>
            {currentMotion.length > 0 &&
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => onYesSubmit()}>YES</Button>
                <Button onClick={() => onNoSubmit()}>NO</Button>
                <Button onClick={() => onAbstSubmit()}>ABSTENTION</Button>
              </ButtonGroup>
            }
          </Card.Body>
        </Card>

        <Card className={styles.card}>
          <Card.Title>Voting History</Card.Title>
          <Card.Body>
            {motionItems.map((item, idx) => {
              return <HistoryCard key={idx} data={item}/>
            })}
          </Card.Body>
        </Card>
      </>}

    </>
  )
}
