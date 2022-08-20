import styles from "../../styles/Home.module.css";
import {Button, Card} from "react-bootstrap";
import React from "react";

export default function VotingHistoryAdminCard() {
  return <Card className={styles.card} id={'votinghistory'}>
    <Card.Title>Voting History</Card.Title>
    <Card.Body>
      <Card className={styles.card}>
        <Card.Title>Questiontitle</Card.Title>
        <Card.Body>
          8 JA | 9 NEIN | 5 Enthaltung
        </Card.Body>
      </Card>
    </Card.Body>
    <Card.Footer>
      <form>
        <label htmlFor={"analogquestion"}>Question:</label><br/>
        <input type={"text"} id={"analogquestion"} name={"analogquestion"}/><br/>
        <label>Results:</label><br/>
        <input type={"text"} id={"yesresult"} name={"analogquestion"} placeholder={"YES: 6"}/><br/>
        <input type={"text"} id={"noresult"} name={"analogquestion"} placeholder={"NO: 6"}/><br/>
        <input type={"text"} id={"abstresult"} name={"analogquestion"} placeholder={"ABSTENTION: 6"}/><br/>
      </form>
      <br/>
      <Button className={styles.button} variant={"outline-success"}>
        Add Analog Voting
      </Button>
      <Button className={styles.button} variant={"danger"}>
        Clear Voting History
      </Button>
    </Card.Footer>
  </Card>
}
