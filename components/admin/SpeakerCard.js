import { Button, Card, Form } from 'react-bootstrap'
import React, { useState } from 'react'

import axios from 'axios'
import styles from '../../styles/Home.module.css'

async function onSpeakerAddSubmit (speakerName, gender) {
  const data = {
    name: speakerName,
    gender
  }

  axios.post('/api/speakers/add', data)
    .then(() => {
      console.info('ADD_SPEAKER', data)
    }).catch(error => {
      console.error(error)
    })
}

async function onSpeakerRemoveSubmit (tickedItems) {
  tickedItems.map((item) => {
    if (item.isChecked) {
      const data = { name: item.name }
      axios.post('/api/speakers/remove', data)
        .then(() => {
          console.info('REMOVE_SPEAKER', data)
        })
        .catch(error => {
          console.error(error)
        })
    }
    return null
  })
}

async function onSpeakerClearSubmit () {
  axios.post('/api/speakers/clear')
    .then(() => {
      console.info('CLEAR_SPEAKERS')
    })
    .catch(error => {
      console.error(error)
    })
}

async function onSpeakerActivateQuotationSubmit () {
  axios.post('/api/settings/quotation')
    .then(() => {
      console.info('CHANGE_QUOTATION')
    })
    .catch(error => {
      console.error(error)
    })
}

export default function SpeakerCard ({ speakerItems, isQuotation }) {
  const [speakerItem, setSpeakerItem] = useState('')
  const [gender, setGender] = useState('')
  const [tickedItems] = useState([])

  if (tickedItems.length === 0) {
    speakerItems.map((item) => {
      tickedItems.push({ ...item, isChecked: false })
      return null
    })
  }
  if (tickedItems.length !== speakerItems.length) {
    while (tickedItems.length > 0) {
      tickedItems.pop()
    }

    speakerItems.map((item) => {
      tickedItems.push({ ...item, isChecked: false })
      return null
    })
  }
  function handleChange (e) {
    tickedItems.map((item) => {
      if (item.name === e.target.value) {
        item.isChecked = e.target.checked
      }
      return item
    })
  }

  return <Card className={styles.card} id={'speakers'}>
    <Card.Title>Speakers&rsquo; List</Card.Title>
    {!isQuotation && <Card.Subtitle>Not quoted</Card.Subtitle>}
    {isQuotation && <Card.Subtitle>Quoted</Card.Subtitle>}
    <Card.Body>
      {!isQuotation && <ol>
        {speakerItems.map((item, idx) => {
          return <li key={idx}>
              <Form.Check type={'checkbox'}
                          id={'idx'}
                          label={item.name + ' | ' + item.gender}
                          value={item.name}
                          onChange={e => handleChange(e)}
              />
            </li>
        }
        )}
      </ol>}

      {isQuotation && <>
        <h6>Men</h6>
        <ol>
          {speakerItems.map((item, idx) => {
            if (item.gender === 'm') {
              return <li key={idx}>
                <Form.Check type={'checkbox'}
                            id={'idx'}
                            label={item.name + ' | ' + item.gender}
                            value={item.name}
                            onChange={e => handleChange(e)}
                />
              </li>
            }
            return null
          })
          }
        </ol>
      </>
      }

      {isQuotation && <>
        <h6>Women</h6>
        <ol>
          {speakerItems.map((item, idx) => {
            if (item.gender === 'w') {
              return <li key={idx}>
                <Form.Check type={'checkbox'}
                            id={'idx'}
                            label={item.name + ' | ' + item.gender}
                            value={item.name}
                            onChange={e => handleChange(e)}
                />
              </li>
            }
            return null
          })
          }
        </ol>
      </>
      }

      {isQuotation && <>
        <h6>Diverse</h6>
        <ol>
          {speakerItems.map((item, idx) => {
            if (item.gender === 'd') {
              return <li key={idx}>
                <Form.Check type={'checkbox'}
                            id={'idx'}
                            label={item.name + ' | ' + item.gender}
                            value={item.name}
                            onChange={e => handleChange(e)}
                />
              </li>
            }
            return null
          })
          }
        </ol>
      </>
      }

    </Card.Body>
    <Card.Footer>
      <fieldset>
        <label htmlFor={'speakername'}>Speaker:</label><br/>
        <input type={'text'} id={'speakername'} name={'speakername'} value={speakerItem}
               onChange={e => setSpeakerItem(e.target.value)}/><br/>

        <input type={'radio'} id={'men'} name={'gender'} value={'m'} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={'men'}> Men</label><br/>

        <input type={'radio'} id={'women'} name={'gender'} value={'w'} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={'women'}> Women</label> <br/>

        <input type={'radio'} id={'diverse'} name={'gender'} value={'d'} onChange={e => setGender(e.target.value)}/>
        <label htmlFor={'diverse'}> Diverse</label> <br/>
      </fieldset>
      <br/>

      <Button className={styles.button}
              variant={'outline-success'}
              onClick={() => {
                onSpeakerAddSubmit(speakerItem, gender).then()
              }
              }>
        Add Speaker
      </Button>

      <Button className={styles.button} variant={'outline-warning'} onClick={() => onSpeakerActivateQuotationSubmit()}>
        Toggle quotation
      </Button>

      <Button className={styles.button} variant={'outline-danger'} onClick={() => onSpeakerRemoveSubmit(tickedItems)}>
        Remove Checked Speaker
      </Button>

      <Button className={styles.button}
              variant={'danger'}
              onClick={() => {
                onSpeakerClearSubmit().then()
              }
      }>
        Clear Speakers&rsquo; List
      </Button>
    </Card.Footer>
  </Card>
}
