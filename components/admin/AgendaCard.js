import React, {useState} from 'react'
import {Button, Card, Form} from "react-bootstrap";

import axios from "axios";
import PropTypes from "prop-types";
import Admin from "../../pages/admin";
import styles from "../../styles/Home.module.css";

async function onAgendaAddSubmit(value) {
  let data = {title: value}
  axios.post('/api/agenda/add', data)
    .then(() => {
      console.log(value)
    })
    .catch((e) => {
      console.error(e)
    })

  axios.get('/api/agenda/retrieve').then()
}

async function onAgendaClearSubmit() {
  axios.post('/api/agenda/clear')
    .then(() => {
    })
    .catch((e) => {
      console.error(e)
    })
}

export default function AgendaCard({ pointsOfOrder }) {
  const [agendaItem, setAgendaItem] = useState('')

  return <Card className={styles.card}>
    <Card.Title>Agenda</Card.Title>

    <Card.Body>
      <Form id={"pointsOfOrder"}>
        {pointsOfOrder.map((item, idx) => {
          return <Form.Check type={"checkbox"} id={item.title} label={item.title} key={idx} />
        })}
      </Form>
    </Card.Body>

    <Card.Footer>
      <fieldset>
        <label htmlFor={"agendaitem"}>Agenda Item Input:</label><br/>
        <input type={"text"} id={"agendaitem"} name={"agendaitem"} value={agendaItem} onChange={e => setAgendaItem(e.target.value)}/><br/>
      </fieldset>
      <br/>
      <Button className={styles.button} variant={"outline-success"} onClick={() => onAgendaAddSubmit(agendaItem)}>
        Add Agenda Item
      </Button>
      <Button className={styles.button} variant={"outline-danger"}>
        Remove Agenda Items
      </Button>
      <Button className={styles.button} variant={"danger"} onClick={() => onAgendaClearSubmit()}>
        Clear Agenda
      </Button>
    </Card.Footer>
  </Card>
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/agenda/retrieve')
  const pointsOfOrder = await response.json()

  return {
    props: {
      pointsOfOrder
    }
  }
}

Admin.propTypes = {
  pointsOfOrder: PropTypes.array
}
