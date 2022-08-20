import styles from "../../styles/Home.module.css";
import {Button, Card} from "react-bootstrap";
import React from "react";


export default function VotingAdminCard () {

  return <Card className={styles.card} id={'voting'}>
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
}
