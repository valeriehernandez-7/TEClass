const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);

function getNeo4jSession() {
    return {
        session: driver.session(),
        driver
    };
}

module.exports = {
    getNeo4jSession,
    driver
};
