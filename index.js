const express = require('express');
const cors = require('cors');
const app = express();

const cursosRouter = require('./src/databases/cassandra/cursos');
const matricularRouter = require('./src/databases/cassandra/matricular');
const connectCassandra = require('./src/databases/cassandra/cassandra');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/cursos', cursosRouter);
app.use('/matricular', matricularRouter);

app.get('/matriculas/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const client = await connectCassandra();
    const result = await client.execute(
      'SELECT * FROM enrollment_by_user WHERE user_id = ?',
      [userId],
      { prepare: true }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener matrículas:', err);
    res.sendStatus(500);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});