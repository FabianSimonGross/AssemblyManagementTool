import React, {useState} from "react";
import styles from "../../styles/Home.module.css";
import {Button, Card, Form} from "react-bootstrap";
import axios from "axios";


async function onSpeakerAddSubmit(speakerName, gender) {
  const data = {
    name: speakerName,
    gender: gender
  }

  axios.post('/api/speakers/add', data)
    .then(() => {
      console.info('ADD_SPEAKER', data)
    }).catch(error => {
    console.error(error)
  })
}

async function onSpeakerRemoveSubmit() {

}

async function onSpeakerClearSubmit() {
  axios.post('/api/speakers/clear')
    .then(() => {
      console.info('CLEAR_SPEAKERS')
    })
    .catch(error => {
      console.error(error)
  })
}

async function onSpeakerActivateQuotationSubmit() {

}


export default function SpeakerCard ( { speakerItems } ) {
  const [speakerItem, setSpeakerItem] = useState('')
  const [gender, setGender] = useState('')


  return <Card className={styles.card} id={'speakers'}>
    <Card.Title>Speakers' List</Card.Title>
    <Card.Subtitle>Nicht quotiert</Card.Subtitle>
    <Card.Body>
      <ol>
        {speakerItems.map((item, idx) => {
          return <li key={idx}>
            <Form.Check type={'checkbox'} id={'idx'} label={item.name + ' | ' + item.gender} />
          </li>
        })}
      </ol>
    </Card.Body>
    <Card.Footer>
      <fieldset>
        <label htmlFor={"speakername"}>Speaker:</label><br/>
        <input type={"text"} id={"speakername"} name={"speakername"} value={speakerItem} onChange={e => setSpeakerItem(e.target.value)}/><br/>

        <input type={"radio"} id={"men"} name={"gender"} value={"m"} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={"men"}> Men</label><br/>

        <input type={"radio"} id={"women"} name={"gender"} value={"w"} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={"women"}> Women</label> <br/>

        <input type={"radio"} id={"diverse"} name={"gender"} value={"d"} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={"diverse"}> Diverse</label> <br/>
      </fieldset>
      <br/>

      <Button className={styles.button}
              variant={"outline-success"}
              onClick={() => {
                onSpeakerAddSubmit(speakerItem, gender)
              }
      }>
        Add Speaker
      </Button>

      <Button className={styles.button} variant={"outline-warning"}>
        Activate quotation
      </Button>

      <Button className={styles.button} variant={"outline-danger"}>
        Remove Speakers
      </Button>

      <Button className={styles.button}
              variant={"danger"}
              onClick={() => {
                onSpeakerClearSubmit()
              }
      }>
        Clear Speakers' List
      </Button>
    </Card.Footer>
  </Card>
}
