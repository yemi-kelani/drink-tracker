const mysql = require('mysql');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const connection = mysql.createConnection({
        host: 'drinkhistory.ckej3xcnfevi.us-east-2.rds.amazonaws.com', 
        user: 'admin',
        password: 'drinktracker',
        database: 'drinkhistory'
    });

    connection.connect();

    const postBody = json.loads(event['body']);

    const insert_sql = "INSERT INTO drinks (drinkid, sessionid, drink_time) VALUES (?, ?, ?);";
    const values = [postBody["drinkid"], postBody["sessionid"], postBody["drink_times"]];
    const queryPromise = new Promise((resolve, reject) => {

        connection.query(insert_sql, values, (error, results, _) => {
            if (error) {
                return reject(error);
            } else if (results.affectedRows !== 1) {
                const failError = new Error("Drink insertion failed.");
                return reject(failError);
            }

            resolve(results);
        });
    });

    let response;
    try {
        await queryPromise;
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify('Added drinks'),
        };
    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            body: JSON.stringify('Failed to insert into the database'),
        };
    } finally {
        connection.end();
    }

    return response;
};
