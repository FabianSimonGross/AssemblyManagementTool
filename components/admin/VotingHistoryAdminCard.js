import axios from 'axios'
import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import styles from '../../styles/Home.module.css'

import HistoryCard from '../voting/HistoryCard'

function onAnalogeVotingSubmit (title, yes, no, abstention) {
  const data = {
    title,
    yes,
    no,
    abstention
  }

  axios.post('/api/voting/addanalogue', data)
    .then(() => {
      console.info('ADD_ANALOGE', data)
    }).catch(error => {
      console.error(error)
    })
}

function onVotingHistoryClearSubmit () {
  axios.post('/api/voting/clear')
    .then(() => {
      console.info('CLEAR_VOTING_HISTORY')
    }).catch(error => {
      console.error(error)
    })
}

export default function VotingHistoryAdminCard ({
  votingItems,
  socket
}) {
  const [question, setQuestion] = useState('')
  const [yes, setYes] = useState(0)
  const [no, setNo] = useState(0)
  const [abs, setAbs] = useState(0)

  return <Card className={styles.card} id={'votinghistory'}>
    <Card.Title>Voting History</Card.Title>
    <Card.Body>
      {votingItems.map((item, idx) => {
        return <HistoryCard key={idx} data={item}/>
      })}
    </Card.Body>
    <Card.Footer>
      <form>
        <label htmlFor={'analogquestion'}>Question:</label><br/>
        <input type={'text'}
               id={'analogquestion'}
               name={'analogquestion'}
               value={question}
               onChange={e => setQuestion(e.target.value)}
        /><br/>

        <label htmlFor={'yesresult'}>YES:</label><br/>
        <input type={'number'}
               id={'yesresult'}
               name={'analogquestion'}
               placeholder={'YES'}
               value={yes}
               onChange={e => setYes(e.target.valueAsNumber)}
        /><br/>

        <label htmlFor={'noresult'}>NO:</label><br/>
        <input type={'number'}
               id={'noresult'}
               name={'analogquestion'}
               placeholder={'NO'}
               value={no}
               onChange={e => setNo(e.target.valueAsNumber)}
        /><br/>

        <label htmlFor={'abstresult'}>ABSTENTION:</label><br/>
        <input type={'number'}
               id={'abstresult'}
               name={'analogquestion'}
               placeholder={'ABSTENTION'}
               value={abs}
               onChange={e => setAbs(e.target.valueAsNumber)}
        /><br/>
      </form>
      <br/>

      <Button className={styles.button}
              variant={'outline-success'}
              onClick={() => {
                onAnalogeVotingSubmit(question, yes, no, abs)
                if (socket) socket.emit('Update Page')
              }}
      >
        Add Analog Voting
      </Button>

      <Button className={styles.button}
              variant={'danger'}
              onClick={() => {
                onVotingHistoryClearSubmit()
                if (socket) socket.emit('Update Page')
              }}
      >
        Clear Voting History
      </Button>
    </Card.Footer>
  </Card>
}
