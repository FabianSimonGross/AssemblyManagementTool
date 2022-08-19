import executeQuery from "../../../lib/db";
import React from 'react'

export default function handler(req, res) {
  return new Promise(async (resolve) => {
    await executeQuery({
      query: 'SELECT * FROM `agendaitems` ORDER BY `agendaitems`.`title`',
      values: null,
    }).then(r => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'max-age=1')
      res.end(JSON.stringify(r))
      resolve()
    }).catch(error => {
      res.json(error)
      res.statusCode(405).end()
      resolve()
    })
  })
}
