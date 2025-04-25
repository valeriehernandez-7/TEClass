const express = require('express');
const router = express.Router();
const {
  sendRequest,
  checkFriendRelationship,
  checkRequestRelationship,
  eliminateRequest,
  makeFriends,
  getRelatedUserIds,
  getRequestedUserIds,
  Matricular,
  getCodigosCursosMatriculados,
  NewCourseRelationship
} = require('./n_functions');

const { enrollUserInCourse } = require('../cassandra/c_functions');

const { getUserDetailsByIds } = require('../mongo/m_functions');

/* This route receives two Mongo IDs (sender and receiver)
and use the function checkFriendRelationship. */

router.get('/check-friend', async (req, res) => {
  const { userId1, userId2 } = req.query;

  if (!userId1 || !userId2) {
    return res.status(400).json({ success: false, message: 'Missing user IDs' });
  }

  try {
    const areFriends = await checkFriendRelationship(userId1, userId2);
    res.status(200).json({ success: true, areFriends });
  } catch (err) {
    console.error('Error in /check-friend route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This route receives two Mongo IDs (sender and receiver)
and use the function checkRequestRelationship. */

router.get('/check-request', async (req, res) => {
  const { fromId, toId } = req.query;

  if (!fromId || !toId) {
    return res.status(400).json({ success: false, message: 'Missing sender or receiver ID' });
  }

  try {
    const hasSentRequest = await checkRequestRelationship(fromId, toId);
    res.status(200).json({ success: true, hasSentRequest });
  } catch (err) {
    console.error('Error in /check-request route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This route receives two Mongo IDs (sender and receiver)
and sends a friend request in Neo4j. */

router.post('/send-request', async (req, res) => {
  const { fromId: senderMongoId, toId: receiverMongoId } = req.body;

  if (!senderMongoId || !receiverMongoId) {
    return res.status(400).json({ success: false, message: 'Missing sender or receiver ID' });
  }
  
  try {
    const result = await sendRequest(senderMongoId, receiverMongoId);

    if (!result.success) {
      const { message } = result;
      if (message === 'Users are already friends.' || message === 'Request already sent.') {
        return res.status(409).json(result);
      }

      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error('Error in /send-request route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This route receives two Mongo IDs and creates a FRIEND relationship using makeFriends */

router.post('/make-friends', async (req, res) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2) {
    return res.status(400).json({ success: false, message: 'Missing user IDs' });
  }

  try {
    const result = await makeFriends(userId1, userId2);
    if (result.success) {
      return res.status(201).json(result);
    }
    return res.status(400).json(result);
  } catch (err) {
    console.error('Error in /make-friends route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This route receives two Mongo IDs and deletes a SEND_REQUEST using eliminateRequest */

router.delete('/eliminate-request', async (req, res) => {
  const { fromId, toId } = req.body;

  if (!fromId || !toId) {
    return res.status(400).json({ success: false, message: 'Missing sender or receiver ID' });
  }

  try {
    const result = await eliminateRequest(fromId, toId);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(404).json(result);
  } catch (err) {
    console.error('Error in /eliminate-request route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This router calls two functions: getRelatedUserIds from Neo4j
and getUserDetailsByIds from Mongo. Retrieves the user's information that
have a FRIEND relationship with the user in session. */

router.get('/friends-info/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const relatedIds = await getRelatedUserIds(userId);
    if (relatedIds.length === 0) {
      return res.status(200).json({ success: true, users: [] });
    }

    const users = await getUserDetailsByIds(relatedIds);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('Error in /friends-info route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/* This router calls two functions: getRequestedUserIds from Neo4j
and getUserDetailsByIds from Mongo. Retrieves the user's information that
have a SEND_REQUEST relationship with the user in session. */

router.get('/sent-requests-info/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const requestedIds = await getRequestedUserIds(userId);
    if (requestedIds.length === 0) {
      return res.status(200).json({ success: true, users: [] });
    }

    const users = await getUserDetailsByIds(requestedIds);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('Error in /sent-requests-info route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/EnrollCourse', async (req, res) => {
  const { courseId, userId } = req.body;

  if (!courseId || !userId) {
    return res.status(400).json({ success: false, message: 'Missing course or user ID' });
  }

  try {
    const neoResult = await Matricular(userId, courseId);
    const cassandraResult = await enrollUserInCourse(userId, courseId);
    
    if (!neoResult.success || !cassandraResult.success) {
      return res.status(400).json({
        success: false,
        message: 'No se pudo completar la matrícula.',
        neoResult,
        cassandraResult
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario matriculado correctamente.',
      neoResult,
      cassandraResult
    });

  } catch (err) {
    console.error('Error en /EnrollCourse:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

router.get('/getCodigosCursosMatriculados/:userId', async (req, res) => {
  const { userId } = req.params || req.query; // Check both params and query for userId

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing user ID' });
  }

  try {
    const result = await getCodigosCursosMatriculados(userId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in /get-cursos-matriculados route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



router.post('/createCourseRelation', async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: 'Missing user or course ID' });
  }

  try {
    const result = await NewCourseRelationship(userId, courseId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in /create-course-relation route:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;
