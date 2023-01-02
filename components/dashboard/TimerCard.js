import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import styles from '../../styles/Home.module.css'

export default function TimerCard ({ socket }) {
  const [localTime, setLocalTime] = useState(180)
  const [isActive, setActive] = useState(false)
  const [isUp, setUp] = useState(false)
  const [isPaused, setPaused] = useState(true)
  useEffect(() => {
    if (socket) {
      socket.on('Timer Time', (distanceTime) => {
        setLocalTime(distanceTime)
        setActive(true)
        setUp(false)
        setPaused(false)

        if (distanceTime <= 1) {
          setLocalTime(0)
          setActive(false)
          setUp(true)
          setPaused(false)
        }
      })

      socket.on('Timer Time Change', (time) => {
        setLocalTime(time)
      })

      socket.on('Start Timer', () => {
        setActive(true)
        setUp(false)
        setPaused(false)
      })

      socket.on('Pause Timer', () => {
        setActive(false)
        setUp(false)
        setPaused(true)
      })

      socket.on('Reset Timer', () => {
        setLocalTime(180)
        setActive(false)
        setUp(false)
        setPaused(true)
      })
    }
  }, [socket])

  return <Card className={styles.card}>
    <center>
      <Card.Title>{localTime} Seconds</Card.Title>

      {isActive && <Card.Subtitle>Timer is running!</Card.Subtitle>}
      {isUp && <Card.Subtitle>Time is up!</Card.Subtitle>}
      {isPaused && <Card.Subtitle>Timer is paused!</Card.Subtitle>}
    </center>
  </Card>
}
