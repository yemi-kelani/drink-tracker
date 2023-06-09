const mysql = require("mysql");

const host = "drinkhistory.ckej3xcnfevi.us-east-2.rds.amazonaws.com";
const user = "admin";
const password = "drinktracker";
const database = "drink_counter";

const connection = mysql.createConnection({ host, user, password, database });
connection.connect();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = (event, context, callback) => {
    // Prevent the lambda from prematurely closing the mysql connection
    context.callbackWaitsForEmptyEventLoop = false;
  
    const reqBody = event.body;
    const insertQuery = "INSERT INTO users(userid) VALUES (?);";
    const values = [parseInt(reqBody.userid)];

    connection.query(insertQuery, values, (error, results, fields) => {
      if (error) {
        console.error(error);
        callback(null, {
            "isBase64Encoded": false,
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: error.toString(),
        });
      } else {
        callback(
            null, {
            "isBase64Encoded": false,
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: "Success",
        });
      }
    });
  };
