import executeQuery from '../../../lib/db'

export default function handler () {
  return new Promise(async () => {
    await executeQuery({
      query: 'UPDATE agendaitems SET agendaitems.active=0 WHERE agendaitems.active=1',
      values: null
    })
  })
}
