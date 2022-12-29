import axios from 'axios'

import Hamburger from 'hamburger-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Container, Navbar, Offcanvas, Table } from 'react-bootstrap'
import io from 'socket.io-client'
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

function addVoter () {
  axios.post('../../api/voters/addvoter')
    .then(() => {
      console.log('ADDED_VOTER')
    })
}

function updateVoter (username, weight) {
  const data = {
    user: username,
    weight
  }
  axios.post('../../api/voters/updatevoter', data)
    .then(() => {
      console.log('Update_Voter')
    }).catch((e) => {
      console.error(e)
    })
}

export default function Agenda () {
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
  const [userRows, setUserRows] = useState([])
  const [refreshToken, setRefreshToken] = useState(Math.random())
  useEffect(() => {
    async function load () {
      if (session) {
        const response = await fetch('/api/voters/retrieve')
        const userRows = await response.json()
        setUserRows(userRows)
      }

      if (toUpdate) {
        setToUpdate(false)
      }
    }

    load().then(setTimeout(() => setRefreshToken(Math.random()), 2500))
  }, [refreshToken, toUpdate])

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
              <img
                src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
                alt="Logo"
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
          <center>
            <h3 className={styles.title}>Users</h3>
          </center>

          {userRows.length > 0 &&
            <Table striped bordered responsive>
              <thead>
              <tr>
                <th>User</th>
                <th>Weight</th>
                <th>Expires</th>
                <th>Last seen</th>
                <td>New weight</td>
              </tr>
              </thead>
              <tbody>
              {userRows.map((item, idx) => {
                return <tr key={idx}>
                  <td>{item.user}</td>
                  <td>{item.weight}</td>
                  <td>{new Date(item.expires).toLocaleString()}</td>
                  <td>{new Date(item.loggedin).toLocaleString()}</td>
                  <td>
                    <span>0</span>
                    <input type={'range'}
                           name={'weight'}
                           max={3}
                           value={item.weight}
                           onChange={(e) => {
                             updateVoter(item.user, e.target.valueAsNumber)
                             if (socket) socket.emit('Update Page')
                           }}
                    />
                    <span>3</span>
                  </td>
                </tr>
              })
              }
              </tbody>

            </Table>
          }
        </>}
    </>
  )
}
