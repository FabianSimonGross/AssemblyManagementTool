import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import Countdown from 'react-countdown'
import styles from '../../styles/Home.module.css'

export default function TimerAdminCard ({ socket }) {
  const [api, setApi] = useState(null)
  const [time, setTime] = useState(180)
  const [activeTimer, setActiveTimer] = useState(false)
  const Completionist = () => <span>Time is up!</span>

  useEffect(() => {
    if (socket) {
      socket.on('Timer Time', (distanceTime) => {
        setActiveTimer(true)
        if (distanceTime < 1) {
          setActiveTimer(false)
        }
      })

      socket.on('Start Timer', () => {
        setActiveTimer(true)
      })

      socket.on('Pause Timer', () => {
        setActiveTimer(true)
      })

      socket.on('Timer Time Change', (time) => {
        setTime(time)
      })

      socket.on('Reset Timer', () => {
        setActiveTimer(false)
      })
    }
  }, [socket])

  function handleStartClick () {
    if (api) {
      api.start()
    }
    socket.emit('Start Timer')
  }

  function handleResetClick () {
    if (api) api.stop()
    socket.emit('Reset Timer')
    setTime(180)
  }

  function handlePauseClick () {
    if (api) {
      api.pause()
    }
    socket.emit('Pause Timer')
  }

  function updateInput (int) {
    if (int >= 0) {
      setTime(int)
    }
  }

  function handleTick () {
    setTime(time - 1)
    socket.emit('Timer Time', time)
  }

  function setRef (countdown) {
    if (countdown) {
      setApi(countdown.getApi())
    }
  }

  return <Card className={styles.card} id={'timer'}>
    <Card.Title>Timer</Card.Title>

    <Card.Body>
      <label htmlFor={'setTimerItem'}>Set Timer (Seconds): </label><br/>
      <input type={'number'}
             id={'setTimerItem'}
             name={'setTimerItem'}
             defaultValue={time}
             min={0}
             onChange={e => {
               updateInput(e.target.valueAsNumber)
               socket.emit('Timer Time Change', e.target.valueAsNumber)
             }}
      /><br/><br/>

      <Countdown date={Date.now() + (time * 1000)}
                 onTick={handleTick}
                 autoStart={false}
                 ref={setRef}
                 onComplete={() => {
                   setTime(0)
                   socket.emit('Timer Time', 0)
                 }}
      >
        <Completionist />
      </Countdown>
    </Card.Body>

    <Card.Footer>
      <Button className={styles.button}
              variant={'success'}
              onClick={handleStartClick}
              disabled={activeTimer}
      >
        Start
      </Button>

      <Button className={styles.button}
              variant={'outline-danger'}
              onClick={handlePauseClick}
      >
        Pause
      </Button>

      <Button className={styles.button}
              variant={'danger'}
              onClick={handleResetClick}
      >
        Reset
      </Button>
    </Card.Footer>
  </Card>
}
