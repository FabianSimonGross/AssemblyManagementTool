import { Button, Card } from 'react-bootstrap'
import React, { useState } from 'react'

import axios from 'axios'
import styles from '../../styles/Home.module.css'

function onNewVotingSubmit (title) {
  const data = {
    title,
    active: 1
  }

  axios.post('/api/voting/setnewactivevote', data)
    .then(() => {
      console.info('SET_NEW_ACTIVE_VOTE', data)
    }).catch(error => {
      console.error(error)
    })
}

function onRestartVotingSubmit () {
  axios.post('/api/voting/restart')
    .then(() => {
      console.info('RESTART_VOTING_OF_CURRENT')
    }).catch(error => {
      console.error(error)
    })
}

function onStopVotingSubmit () {
  axios.post('/api/voting/stopactive')
    .then(() => {
      console.info('STOP_VOTING_OF_CURRENT')
    }).catch(error => {
      console.error(error)
    })
}

export default function VotingAdminCard ({ currentMotionItem }) {
  const [questionItem, setQuestionItem] = useState('')

  return <Card className={styles.card} id={'voting'}>
    <Card.Title>Voting Administration</Card.Title>
    {currentMotionItem.length > 0 && currentMotionItem.map((item, idx) => {
      return <div key={idx}>
      <Card.Subtitle>{item.title}</Card.Subtitle>
      </div>
    })}

    {currentMotionItem.length < 1 && <Card.Subtitle>No Active Question</Card.Subtitle>}
    <Card.Body>
      <fieldset>
        <label htmlFor={'question'}>The Question:</label><br/>
        <input type={'text'} id={'question'} name={'question'} value={questionItem} onChange={e => setQuestionItem(e.target.value)}/>
      </fieldset>
    </Card.Body>
    <Card.Footer>
      <Button className={styles.button} variant={'outline-success'} onClick={() => onNewVotingSubmit(questionItem)}>
        Start new Vote
      </Button>
      <Button className={styles.button} variant={'outline-warning'} onClick={() => onRestartVotingSubmit()}>
        Restart Voting
      </Button>
      <Button className={styles.button} variant={'danger'} onClick={() => onStopVotingSubmit()}>
        Stop Voting
      </Button>
    </Card.Footer>
  </Card>
}
