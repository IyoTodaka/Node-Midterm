const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '19882003bB',
  database: 'node_midterm_db'
});

connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  });

  app.get('/', (req, res) => {
    connection.query(
      'SELECT * FROM users',
      (error, results) => {
        console.log(results);
        res.render('hello.ejs');
      }
    );
  });
  
  app.listen(8000);