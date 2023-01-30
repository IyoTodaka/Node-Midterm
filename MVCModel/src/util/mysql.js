const mysql = require("mysql2");
console.log("MYSQL_HOST: ", process.env.DB_HOST);

// DBのスキーマから取得した情報をためておくプールを作る
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
// ↓もしtableがなかった場合にcreate tableする処理、今回はテーブルを作って実行するのでいらない。

// const sql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='`+ pool.database +`' AND TABLE_NAME='Books'`; 
// //to query and check if table "Books" exists

//   pool.query(sql, (err, data) => {
//     if (err) {
//       return console.error(err.message);
//     }
  
//     if (data.length === 0) {
//       console.log("Table 'Books' does not exist");
//       seedDB();
//     } else {
//       console.log("Table 'Books' exists");
//     }
//   });
//   const seedDB = () => {
//     pool.query(`DROP TABLE IF EXISTS Books`);
  
//     pool.query(
//       `CREATE TABLE Books (
//           Book_ID INT PRIMARY KEY AUTO_INCREMENT,
//           Title VARCHAR(100) NOT NULL,
//           Author VARCHAR(100) NOT NULL,
//           Comments TEXT
//         )`,
//       (err) => {
//         if (err) {
//           return console.error(err.message);
//         }
//         console.log("Successful creation of the 'Books' table");
//       }
//     );
  
//     pool.query(
//       `
//         INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
//         (1, 'How To Eat', 'Kui S. Hinbo', 'Absolutely salivating'),
//         (2, 'Does Your Cat Want to Murder You?', 'Dolly M. Scratches', 'Unexpectedly chilling'),
//         (3, 'Dame da', 'Ai Gibu-up', 'Who cut the onions?');`,
//       (err) => {
//         if (err) {
//           return console.error(err.message);
//         }
//         console.log("Successful creation of 3 books");
//       }
//     );
//   };
  module.exports = pool.promise();