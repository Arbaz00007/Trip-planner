import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "toursystem",
  multipleStatements: true,
});

if (!db.connect) {
  console.log("Error connecting to database");
}
