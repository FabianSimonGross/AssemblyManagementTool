import executeQuery from '../../../lib/db'

export default async function handler (req, res) {
  let result

  try {
    await executeQuery({
      query: 'SELECT * FROM `settings` WHERE `settings`.`setting`="quotation"',
      values: null
    }).then(r => {
      result = JSON.parse(JSON.stringify(r))
    })

    if (result[0].setting === 'quotation' && result[0].bool === 0) {
      await executeQuery({
        query: 'UPDATE settings SET settings.bool=1 WHERE settings.setting="quotation"',
        values: null
      })
    } else {
      await executeQuery({
        query: 'UPDATE settings SET settings.bool=0 WHERE settings.setting="quotation"',
        values: null
      })
    }
  } catch (error) {
  }
}
