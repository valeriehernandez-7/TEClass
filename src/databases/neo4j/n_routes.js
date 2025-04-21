const express = require('express');
const router = express.Router();
const { sendRequest,
        checkFriendRelationship,
        checkRequestRelationship 
} = require('./n_functions');

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
      console.log('Result:', result);
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

module.exports = router;
