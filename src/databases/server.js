const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./mongo/m_routes');

app.use(cors());
app.use(express.json());
app.use('/api', router);

/* 
The databse will run in port 4000, because the port 3000 is used by the react app.
*/

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
