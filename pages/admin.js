import axios from 'axios'

import Hamburger from 'hamburger-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Container, Navbar, Offcanvas } from 'react-bootstrap'

import AgendaCard from '../components/admin/AgendaCard'
import SpeakerCard from '../components/admin/SpeakerCard'
import VotingAdminCard from '../components/admin/VotingAdminCard'
import VotingHistoryAdminCard from '../components/admin/VotingHistoryAdminCard'
import styles from '../styles/Home.module.css'

function addVoter () {
  axios.post('../../api/voters/addvoter')
    .then(() => {
      console.log('ADDED_VOTER')
    })
}

export default function Admin () {
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
  const [agendaItems, setAgendaItems] = useState([])
  const [speakersItems, setSpeakersItems] = useState([])
  const [isQuotation, setQuotation] = useState(false)
  const [motionItems, setMotionsItems] = useState([])
  const [currentMotionItem, setCurrentMotionItem] = useState([])
  useEffect(() => {
    async function load () {
      if (session) {
        const agendaResponse = await fetch('/api/agenda/retrieve')
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

        const motionResponse = await fetch('/api/voting/retrieve')
        const motionItems = await motionResponse.json()
        setMotionsItems(motionItems)

        const currentMotionResponse = await fetch('/api/voting/retrievecurrent')
        const currentMotionItem = await currentMotionResponse.json()
        setCurrentMotionItem(currentMotionItem)
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
        <meta name="description" content="Digital Voting for Assembly's by Neuland Ingolstadt"/>
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
        <AgendaCard pointsOfOrder={agendaItems}/>

        <SpeakerCard speakerItems={speakersItems} isQuotation={isQuotation}/>

        <VotingAdminCard currentMotionItem={currentMotionItem}/>

        <VotingHistoryAdminCard votingItems={motionItems}/>

      </>}
    </>
  )
}
