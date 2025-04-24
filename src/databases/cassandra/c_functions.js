const connectCassandra = require('./c_connection');

async function enrollUserInCourse(userId, courseId) {
  const client = await connectCassandra();
  const query = `
    INSERT INTO enrollment_by_user (user_id, course_id, enrolled_at, evaluations)
    VALUES (?, ?, toTimestamp(now()), []);
  `;
  await client.execute(query, [userId, courseId], { prepare: true });
}

module.exports = {
  enrollUserInCourse
};

