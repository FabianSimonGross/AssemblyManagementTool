import styles from "../../styles/Home.module.css";
import {Button, Card} from "react-bootstrap";
import React, {useState} from "react";
import axios from "axios";

function onNewVotingSubmit(title) {
  const data = {
    title: title,
    active: 1
  }

  axios.post('/api/voting/setnewactivevote', data)
    .then(() => {
      console.info('SET_NEW_ACTIVE_VOTE',data)
    }).catch(error => {
    console.error(error)
  })
}

export default function VotingAdminCard () {
  const [questionItem, setQuestionItem] = useState('')

  return <Card className={styles.card} id={'voting'}>
    <Card.Title>Voting Administration</Card.Title>
    <Card.Subtitle>Current Question in Green</Card.Subtitle>
    <Card.Body>
      <fieldset>
        <label htmlFor={"question"}>The Question:</label><br/>
        <input type={"text"} id={"question"} name={"question"} value={questionItem} onChange={e => setQuestionItem(e.target.value)}/>
      </fieldset>
    </Card.Body>
    <Card.Footer>
      <Button className={styles.button} variant={"outline-success"} onClick={() => onNewVotingSubmit(questionItem)}>
        Start new Vote
      </Button>
      <Button className={styles.button} variant={"outline-warning"}>
        Restart Voting
      </Button>
      <Button className={styles.button} variant={"danger"}>
        Stop Voting
      </Button>
    </Card.Footer>
  </Card>
}
