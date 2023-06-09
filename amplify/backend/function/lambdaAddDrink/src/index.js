const mysql = require("mysql");

const host = "drinkhistory.ckej3xcnfevi.us-east-2.rds.amazonaws.com";
const user = "admin";
const password = "drinktracker";
const database = "drink_counter";

const conn = mysql.createConnection({ host, user, password, database });
conn.connect();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context, callback) => {
  // Prevent the lambda from prematurely closing the mysql connection
  context.callbackWaitsForEmptyEventLoop = false;

  const reqBody = event.body;

  // Perform the INSERT statement
  const insertQuery =
    "INSERT INTO drinks (sessionid, drink_time) VALUES (?, ?)";
  const values = [parseInt(reqBody.sessionid), reqBody.drink_time];

  conn.query(insertQuery, values, (err, results, fields) => {
    if (err) {
      console.error(err);
      callback(null, {
        statusCode: 400,
        body: err.toString(),
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: "Success",
      });
    }
  });
};
