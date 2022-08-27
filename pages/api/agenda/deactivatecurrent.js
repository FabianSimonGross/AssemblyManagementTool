import executeQuery from '../../../lib/db'

export default async function handler () {
  try {
    await executeQuery({
      query: 'UPDATE agendaitems SET agendaitems.active=0 WHERE agendaitems.active=1',
      values: null
    })
  } catch (error) {
  }
}
