import React from "react";
import {Card} from "react-bootstrap";
import styles from "../../styles/Home.module.css";

import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HistoryCard (data) {
  const dataset = {
    labels: [
      'YES',
      'NO',
      'ABSTENTION'
    ],
    datasets: [
      {
        data: [
          data.data.yes,
          data.data.no,
          data.data.abstention
        ],
        backgroundColor: [
          '#A2CD5A',
          '#CD5555',
          '#D3D3D3'
        ],
      }
    ]
  }

  return <Card className={styles.card}>
    <Card.Title>{data.data.title}</Card.Title>
    {data.data.active < 1 && <Card.Subtitle>Inactive</Card.Subtitle>}
    {data.data.active > 0 && <Card.Subtitle>Active</Card.Subtitle>}
    <Card.Body>
      <Pie
        className={styles.doughnut}
        data={dataset}
      />
    </Card.Body>
  </Card>
}
