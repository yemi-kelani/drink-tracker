const mysql = require('mysql');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const drinks = event.pathParameters.drinks;
    const connection = mysql.createConnection({
        host: 'drinkhistory.ckej3xcnfevi.us-east-2.rds.amazonaws.com', 
        user: 'admin',
        password: 'drinktracker',
        database: 'drinkhistory'
    });

    connection.connect();

    const queryPromise = new Promise((resolve, reject) => {
        connection.query('INSERT INTO drinkhistory SET ?', {drink: drinks}, (error, results, fields) => {
            if (error) {
                return reject(error);
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
