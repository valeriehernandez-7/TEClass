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

/* This function verifies the relationships: SEND_REQUEST and FRIEND
between two users and sends a request */

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

/* Function that deletes a SEND_REQUEST relationship between two users */

async function eliminateRequest(userId1, userId2) {
    const { session } = getNeo4jSession();

    try {
        const id1 = userId1.toString();
        const id2 = userId2.toString();

        const result = await session.run(
            `
            MATCH (u1:User {user_id: $id1})-[r:SEND_REQUEST]->(u2:User {user_id: $id2})
            DELETE r
            RETURN COUNT(r) AS deletedCount
            `,
            { id1, id2 }
        );

        const deletedCount = result.records[0]?.get('deletedCount').toInt();

        if (deletedCount > 0) {
            return { success: true, message: 'Request deleted successfully.' };
        } else {
            return { success: false, message: 'No SEND_REQUEST relationship found.' };
        }

    } catch (error) {
        console.error('Error deleting SEND_REQUEST relationship:', error);
        return { success: false, message: 'Internal error.' };
    } finally {
        await session.close();
    }
}

/* Function that creates a FRIEND relationship and deletes any existing SEND_REQUEST */

async function makeFriends(userId1, userId2) {
    const { session } = getNeo4jSession();

    try {
        const id1 = userId1.toString();
        const id2 = userId2.toString();

        const result = await session.run(
            `
            MATCH (u1:User {user_id: $id1})
            MATCH (u2:User {user_id: $id2})
            MERGE (u1)-[:FRIEND]->(u2)
            MERGE (u2)-[:FRIEND]->(u1)
            RETURN u1, u2
            `,
            { id1, id2 }
        );

        if (result.records.length === 0) {
            return { success: false, message: 'Failed to create friendship.' };
        }

        /* Delete the SEND_REQUEST if it exists. It goes from id2 to id1, because
        when the user accept the request, the order is inverted. */
        const eliminationResult = await eliminateRequest(id2, id1);
        return { success: true, message: 'Users are now friends.', elimination: eliminationResult };

    } catch (error) {
        console.error('Error creating FRIEND relationship:', error);
        return { success: false, message: 'Internal error.' };
    } finally {
        await session.close();
    }
}

/* Function that retrieves the IDs of friends of a user */

async function getRelatedUserIds(userId) {
    const { session } = getNeo4jSession();
  
    try {
      const result = await session.run(
        `
        MATCH (u:User {user_id: $userId})-[:FRIEND]-(friend:User)
        RETURN friend.user_id AS friendId
        `,
        { userId }
    );
        return result.records.map(record => record.get('friendId'));
    } catch (error) {
        console.error('Error getting related user IDs from Neo4j:', error);
        throw error;
    } finally {
        await session.close();
    }
}  

/*This function returns a list of user IDs that the given user has sent friend requests to.
The relationship searched is SEND_REQUEST. */

async function getRequestedUserIds(userId) {
    const { session } = getNeo4jSession();
  
    try {
        const result = await session.run(
            `
            MATCH (requested:User)-[:SEND_REQUEST]->(u:User {user_id: $userId})
            RETURN requested.user_id AS requestedId
            `,
            { userId }
        );
        return result.records.map(r => r.get('requestedId'));
    } catch (error) {
        console.error('Error getting sender user IDs from Neo4j:', error);
        throw error;
    } finally {
        await session.close();
    }
}  

async function getCodigosCursosCreados(userId) {
    const { session } = getNeo4jSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User {user_id: $userId})-[:CREATED]->(c:Course)
            RETURN c.course_id AS codigo
            `,
            { userId }
        );

        return result.records.map(r => r.get('codigo'));
    } catch (error) {
        console.error('Error getting codigos de cursos creados:', error);
        throw error;
    } finally {
        await session.close();
    }
}


async function getCodigosCursosMatriculados(userId) {
    const { session } = getNeo4jSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User {user_id: $userId})-[:ENROLLED_IN]->(c:Course)
            RETURN c.course_id AS codigo
            `,
            { userId }
        );

        return result.records.map(r => r.get('codigo'));
    } catch (error) {
        console.error('Error getting codigos de cursos matriculados:', error);
        throw error;
    } finally {
        await session.close();
    }
}

async function getIdsEstudiantesMatriculados(codigoCurso) {
    const { session } = getNeo4jSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User)-[:ENROLLED_IN]->(c:Course {codigo: $codigoCurso})
            RETURN u.user_id AS id
            `,
            { codigoCurso }
        );

        return result.records.map(r => r.get('id'));
    } catch (error) {
        console.error('Error getting IDs de estudiantes matriculados:', error);
        throw error;
    } finally {
        await session.close();
    }
}

async function Matricular(userId, courseId) {
    const { session } = getNeo4jSession();
  
    const id1 = userId.toString();
    const id2 = courseId.toString();
  
    try {
      const checkResult = await session.run(
        `
        MATCH (u:User {user_id: $id1})-[r:ENROLLED_IN]->(c:Course {course_id: $id2})
        RETURN r
        `,
        { id1, id2 }
      );
      
      if (checkResult.records.length > 0) {
        return { success: false, message: 'Ya estás matriculado en este curso.' };
      }

      const enrollResult = await session.run(
        `
        MERGE (u:User {user_id: $id1})
        MERGE (c:Course {course_id: $id2})
        CREATE (u)-[:ENROLLED_IN]->(c)
        CREATE (c)-[:HAS_ENROLED]->(u)
        RETURN u, c
        `,
        { id1, id2 }
      );
  
      if (enrollResult.records.length === 0) {
        return { success: false, message: 'No se pudo matricular en el curso.' };
      }
  
      return { success: true, message: 'Matriculado correctamente en el curso.' };
  
    } catch (error) {
      console.error('Error al matricular en Neo4j:', error);
      return { success: false, message: 'Error interno en Neo4j.' };
    } finally {
      await session.close();
    }
}  

async function NewCourseRelationship (userId, courseId) {
    const { session } = getNeo4jSession();

    try {
        const result = await session.run(
            `
            MERGE (u:User {user_id: $userId})
            MERGE (c:Course {course_id: $courseId})
            MERGE (u)-[:CREATED]->(c)
            RETURN u, c
            `,
            { userId, courseId }
        );

        if (result.records.length === 0) {
            return { success: false, message: 'Failed to create course relationship.' };
        }

        return { success: true, message: 'Course relationship created successfully.' };

    } catch (error) {
        console.error('Error creating course relationship:', error);
        return { success: false, message: 'Internal error.' };
    } finally {
        await session.close();
    }
}

async function getEstudiantesIds(CourseId) {
    const { session } = getNeo4jSession();

    try {
        const result = await session.run(
            `
            MATCH (c:Course {course_id: $CourseId})-[:HAS_ENROLED]->(u:User)
            RETURN u.user_id AS id
            `,
            { CourseId }
        );

        return result.records.map(r => r.get('id'));
    } catch (error) {
        console.error('Error consiguiendo los id de los estudiantes matriculados:', error);
        throw error;
    } finally {
        await session.close();
    }
}

module.exports = {
    checkFriendRelationship,
    checkRequestRelationship,
    sendRequest,
    eliminateRequest,
    makeFriends,
    getRelatedUserIds,
    getRequestedUserIds,
    getCodigosCursosCreados,
    getCodigosCursosMatriculados,
    Matricular,
    NewCourseRelationship,
    getEstudiantesIds
};
