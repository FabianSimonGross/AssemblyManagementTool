import axios from 'axios'
import Hamburger from 'hamburger-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { Button, ButtonGroup, Card, Container, Navbar, Offcanvas } from 'react-bootstrap'
import io from 'socket.io-client'
import TimerCard from '../components/dashboard/TimerCard'
import HistoryCard from '../components/voting/HistoryCard'
import styles from '../styles/Home.module.css'

function useSocket (url) {
  const [socket, setSocket] = useState(io)
  useEffect(() => {
    fetch(url).finally(() => {
      const socketio = io()
      socketio.on('connect', () => {
        console.log('Connected')
      })
      socketio.on('disconnect', () => {
        console.log('Disconnected')
      })
      setSocket(socketio)
    })
    function cleanup () {
      socket.disconnect()
    }
    return cleanup
  }, [])
  return socket
}

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

function addVoter () {
  axios.post('../../api/voters/addvoter')
    .then(() => {
      console.log('ADDED_VOTER')
    })
    .catch((e) => {
      console.error(e)
    })
}

export default function Home () {
  const router = useRouter()

  /***
   * Socket Management
   */
  const socket = useSocket('/api/socket')
  useEffect(() => {
    if (socket) {
      socket.on('Update Page', () => {
        setToUpdate(true)
      })
    }
  }, [socket])

  /**
   * Managing Sessions
   */
  const { data: session } = useSession()
  const [isInDatabase, setIsInDatabase] = useState(false)
  const [isAdmin, setAdmin] = useState(false)
  if (session && !isInDatabase) {
    setIsInDatabase(true)
    setAdmin(session.user.isAdmin)
    addVoter()

    if (socket) socket.emit('Update Page')
  }

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
  const [toUpdate, setToUpdate] = useState(false)
  const [refreshToken, setRefreshToken] = useState(Math.random())
  const [motionItems, setMotionsItems] = useState([])
  const [currentMotion, setCurrentAgendaItem] = useState([])
  const [agendaItems, setAgendaItems] = useState([])
  const [speakersItems, setSpeakersItems] = useState([])
  const [isQuotation, setQuotation] = useState(false)
  const [voted, setVoted] = useState(0)
  const [weight, setWeight] = useState(0)
  useEffect(() => {
    async function load () {
      if (session) {
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

        const response = await fetch('/api/voters/retrieve')
        const userRows = await response.json()
        userRows.map((item) => {
          if (item.user === session.user.username) {
            setWeight(item.weight)
            setVoted(item.voted)
          }
          return null
        })

        const quotationResponse = await fetch('/api/settings/retrievequotation')
        const quotation = await quotationResponse.json()
        if (quotation[0].bool !== 0) {
          setQuotation(true)
        } else {
          setQuotation(false)
        }
      }

      if (toUpdate) {
        setToUpdate(false)
      }
    }

    load().then(setTimeout(() => setRefreshToken(Math.random()), 5000))
  }, [refreshToken, router, toUpdate])

  return (
    <>
      <Head>
        <title>Assembly Management Tool</title>
        <meta name="description" content="Digital Assembly Management by Neuland Ingolstadt"/>
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
              {isAdmin && <>
                <li>
                  <Link href="admin">
                    <h4>Administration</h4>
                  </Link>
                </li>
                <li>
                  <Link href="useradmin">
                    <h4>User Administration</h4>
                  </Link>
                </li>
              </>
              }

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

        <TimerCard socket={socket}></TimerCard>

        <Card className={styles.card}>
          <Card.Title>Speakers&rsquo; List</Card.Title>
          {!isQuotation && <Card.Subtitle>Not quoted</Card.Subtitle>}
          {isQuotation && <Card.Subtitle>Quoted</Card.Subtitle>}
          <Card.Body>
            {!isQuotation && <ol>
              {speakersItems.map((item, idx) => {
                if (!item.active) {
                  return <li key={idx}>{item.name + ' | ' + item.gender}</li>
                }
                return <li key={idx}>{item.name + ' | ' + item.gender + ' | Speaking'}</li>
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
            {currentMotion.length > 0 && Array.from({ length: weight - voted }, (_, idx) =>
              <div key={idx} className={styles.buttongroup}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button
                    onClick={() => {
                      onYesSubmit()
                      setVoted(voted + 1)
                      setToUpdate(true)
                      if (socket) socket.emit('Update Page')
                    }}
                  >YES</Button>
                  <Button
                    onClick={() => {
                      onNoSubmit()
                      setVoted(voted + 1)
                      setToUpdate(true)
                      if (socket) socket.emit('Update Page')
                    }}
                  >NO</Button>
                  <Button
                    onClick={() => {
                      onAbstSubmit()
                      setVoted(voted + 1)
                      setToUpdate(true)
                      if (socket) socket.emit('Update Page')
                    }}
                  >ABSTENTION</Button>
              </ButtonGroup>
              </div>
            )}
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
