const { getNeo4jSession } = require('./n_connection');

/* Function that verifies in Neo4j, if the users have a FRIEND relationship */

async function checkFriendRelationship(userId1, userId2) {
    const { session } = getNeo4jSession();

    try {
        const id1 = userId1.toString();
        const id2 = userId2.toString();

        const result = await session.run(
            `
            MERGE (u1:User {user_id: $id1})
            MERGE (u2:User {user_id: $id2})
            RETURN EXISTS((u1)-[:FRIEND]-(u2)) AS areFriends
            `,
            { id1, id2 }
        );

        const areFriends = result.records[0]?.get('areFriends');
        return areFriends;

    } catch (error) {
        console.error('Error checking FRIEND relationship:', error);
        return false;
    } finally {
        await session.close();
    }
}

/* Function that verifies in Neo4j, if the users have a SEND_REQUEST relationship */

async function checkRequestRelationship(userId1, userId2) {
    const { session } = getNeo4jSession();

    try {
        const id1 = userId1.toString();
        const id2 = userId2.toString();

        const result = await session.run(
            `
            MERGE (u1:User {user_id: $id1})
            MERGE (u2:User {user_id: $id2})
            RETURN EXISTS((u1)-[:SEND_REQUEST]->(u2)) AS hasRequest
            `,
            { id1, id2 }
        );

        const hasRequest = result.records[0]?.get('hasRequest');
        return hasRequest;

    } catch (error) {
        console.error('Error checking SEND_REQUEST relationship:', error);
        return false;
    } finally {
        await session.close();
    }
}

async function sendRequest(senderMongoId, receiverMongoId) {
    const areFriends = await checkFriendRelationship(senderMongoId, receiverMongoId);
    if (areFriends) {
        return { success: false, message: 'Users are already friends.' };
    }

    const hasSentRequest = await checkRequestRelationship(senderMongoId, receiverMongoId);
    if (hasSentRequest) {
        return { success: false, message: 'Request already sent.' };
    }

    const { session } = getNeo4jSession();

    try {
        const senderId = senderMongoId.toString();
        const receiverId = receiverMongoId.toString();

        const result = await session.run(
            `
            MATCH (sender:User {user_id: $senderId})
            MATCH (receiver:User {user_id: $receiverId})
            CREATE (sender)-[r:SEND_REQUEST {date: datetime()}]->(receiver)
            RETURN r
            `,
            { senderId, receiverId }
        );

        if (result.records.length === 0) {
            return { success: false, message: 'Failed to create request.' };
        }

        return { success: true, message: 'Request sent successfully.' };

    } catch (error) {
        console.error('Error in sendRequest:', error);
        return { success: false, message: 'Internal error.' };
    } finally {
        await session.close();
    }
}

module.exports = {
    checkFriendRelationship,
    checkRequestRelationship,
    sendRequest
};
