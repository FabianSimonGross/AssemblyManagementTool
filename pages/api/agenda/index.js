import excuteQuery from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const result = await excuteQuery({
      query: 'INSERT INTO post(content) VALUES(?)',
      values: [req.body.content],
    });
    console.log("ttt", result);
  } catch (error) {

  }


  res.status(200)
}
