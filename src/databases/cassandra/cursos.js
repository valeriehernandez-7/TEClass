const express = require('express');
const router = express.Router();
const connectCassandra = require('./cassandra');

router.get('/', async (req, res) => {
  try {
    const client = await connectCassandra();
    const query = 'SELECT * FROM evaluation_by_course;';
    const result = await client.execute(query);
    console.log('Cursos encontrados:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).send('Error al obtener cursos');
  }
});

module.exports = router;