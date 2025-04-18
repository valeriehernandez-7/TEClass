const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./mongo/m_router');

app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
