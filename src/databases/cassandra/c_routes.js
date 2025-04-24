const express = require('express');
const router = express.Router();
const { enrollUserInCourse 
  
} = require('./c_functions');

router.post('/enroll-by-user', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    await enrollUserInCourse(userId, courseId);
    return res.status(200).send('Matrícula registrada correctamente');
  } catch (error) {
    console.error('Error al matricular:', error);
    return res.status(500).send('Error al matricular');
  }
});

module.exports = router;
