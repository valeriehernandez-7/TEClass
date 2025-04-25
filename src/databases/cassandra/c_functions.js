const connectCassandra = require('./c_connection');

async function enrollUserInCourse(userId, courseId) {
  const client = await connectCassandra();

  const userIdStr = userId.toString();
  const courseIdStr = courseId.toString();

  try {
    const checkQuery = `
      SELECT * FROM enrollment_by_user WHERE user_id = ? AND course_id = ?;
    `;
    const result = await client.execute(checkQuery, [userIdStr, courseIdStr], { prepare: true });

    if (result.rowLength > 0) {
      return { success: false, message: 'Ya estás matriculado en este curso (Cassandra).' };
    }

    const insertQuery = `
      INSERT INTO enrollment_by_user (user_id, course_id, enrolled_at, evaluations)
      VALUES (?, ?, toTimestamp(now()), []);
    `;
    await client.execute(insertQuery, [userIdStr, courseIdStr], { prepare: true });

    return { success: true, message: 'Matriculado correctamente en Cassandra.' };

  } catch (err) {
    console.error('Error en Cassandra:', err);
    return { success: false, message: 'Error en Cassandra: ' + err.message };
  }
}

module.exports = {
  enrollUserInCourse
};
