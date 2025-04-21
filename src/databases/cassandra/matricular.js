const express = require('express');
const router = express.Router();
const connectCassandra = require('./cassandra');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const client = await connectCassandra();

    const query = `
      INSERT INTO enrollment_by_user (user_id, course_id, enrolled_at, evaluations)
      VALUES (?, ?, toTimestamp(now()), []);
    `;
    await client.execute(query, [userId, courseId], { prepare: true });
    return res.status(200).send('Matrícula registrada correctamente');
  } catch (error) {
    console.error('Error al matricular:', error);
    return res.status(500).send('Error al matricular');
  }
});

module.exports = router;