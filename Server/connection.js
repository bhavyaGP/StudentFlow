const mysql2 = require('mysql2');

// Create a MySQL connection using the mysql2 library

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bhavya#5678',
    database: 'progressmatrix',
    debug: false,
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        process.exit(1);  // Exit the process with a failure code if the connection fails
    } else {
        console.log('Connected to MySQL as ID', connection.threadId);
    }
});

// Handle connection errors after the initial connection
connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Reconnect if the connection is lost
        connection.connect((err) => {
            if (err) {
                console.error('Error reconnecting to MySQL:', err.stack);
                process.exit(1);
            } else {
                console.log('Reconnected to MySQL as ID', connection.threadId);
            }
        });
    } else {
        throw err;
    }
});

module.exports = connection;
