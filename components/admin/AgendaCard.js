import axios from 'axios'
import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import styles from '../../styles/Home.module.css'

async function onAgendaAddSubmit (value) {
  const data = { title: value }
  axios.post('/api/agenda/add', data)
    .then(() => {
      console.info('ADD_AGENDA', data)
    })
    .catch(error => {
      console.error(error)
    })
}

async function onAgendaClearSubmit () {
  axios.post('/api/agenda/clear')
    .then(() => {
      console.info('CLEAR_AGENDA')
    })
    .catch(error => {
      console.error(error)
    })
}

async function onAgendaRemoveSubmit (tickedItems) {
  tickedItems.map((item) => {
    if (item.isChecked) {
      const data = { title: item.title }
      axios.post('/api/agenda/remove', data)
        .then(() => {
          console.info('REMOVE_AGENDA', data)
        })
        .catch(error => {
          console.error(error)
        })
    }
    return null
  })
}

function onAgendaSetCurrent (title) {
  const data = { title }
  axios.post('/api/agenda/setcurrent', data)
    .then(() => {
      console.info('SET_CURRENT_AGENDA', data)
    })
    .catch(error => {
      console.error(error)
    })
}

function onAgendaDeactivateCurrent () {
  axios.post('/api/agenda/deactivatecurrent')
    .then(() => {
      console.info('DEACTIVATE_CURRENT_AGENDA')
    })
    .catch(error => {
      console.error(error)
    })
}

export default function AgendaCard ({
  pointsOfOrder,
  socket
}) {
  const [agendaItem, setAgendaItem] = useState('')
  const [tickedItems] = useState([])

  if (tickedItems.length === 0) {
    pointsOfOrder.map((item) => {
      tickedItems.push({
        ...item,
        isChecked: false
      })
      return null
    })
  }

  if (tickedItems.length !== pointsOfOrder.length) {
    while (tickedItems.length > 0) {
      tickedItems.pop()
    }

    pointsOfOrder.map((item) => {
      tickedItems.push({ ...item, isChecked: false })
      return null
    })
  }

  function handleChange (e) {
    tickedItems.map((item) => {
      if (item.title === e.target.value) {
        item.isChecked = e.target.checked
      }
      return item
    })
  }

  return <Card className={styles.card} id={'agenda'}>
    <Card.Title>Agenda</Card.Title>

    <Card.Body>
      <Form id={'pointsOfOrder'}>
        {pointsOfOrder.map((item, idx) => {
          return <div key={idx}>
            <Form.Check type={'checkbox'}
                        id={item.title}
                        label={item.title}
                        value={item.title}
                        onChange={e => handleChange(e, pointsOfOrder)}
            />

            {item.active < 1 && <Button variant={'link'} onClick={() => {
              onAgendaSetCurrent(item.title)
              if (socket) socket.emit('Update Page')
            }}>Activate</Button>}

            {item.active > 0 && <Button variant={'link'} onClick={() => {
              onAgendaDeactivateCurrent()
              if (socket) socket.emit('Update Page')
            }}>Deactivate</Button>}
          </div>
        })}
      </Form>
    </Card.Body>

    <Card.Footer>
      <fieldset>
        <label htmlFor={'agendaitem'}>Agenda Item Input:</label><br/>
        <input type={'text'}
               id={'agendaitem'}
               name={'agendaitem'}
               value={agendaItem}
               onChange={e => {
                 setAgendaItem(e.target.value)
                 if (socket) socket.emit('Update Page')
               }}
        /><br/>
      </fieldset>
      <br/>

      <Button className={styles.button}
              variant={'outline-success'}
              onClick={() => {
                onAgendaAddSubmit(agendaItem)
                if (socket) socket.emit('Update Page')
              }}>
        Add Agenda Item
      </Button>

      <Button className={styles.button}
              variant={'outline-danger'}
              onClick={() => {
                onAgendaRemoveSubmit(tickedItems)
                if (socket) socket.emit('Update Page')
              }}
      >
        Remove Checked Agenda Item
      </Button>

      <Button className={styles.button}
              variant={'danger'}
              onClick={() => {
                onAgendaClearSubmit().then()
                if (socket) socket.emit('Update Page')
              }}
      >
        Clear Agenda
      </Button>

    </Card.Footer>
  </Card>
}
