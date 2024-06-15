const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'ryan_sloan',
//   host: 'localhost',
//   database: 'first_test_db',
//   password: 'root',
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:<your admin password>@localhost:5432/<your db name>',
  ssl: process.env.DATABASE_URL ? true : false
});

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

//get all merchants our database
const getBehaviorData = async () => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM behaviordata", (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Internal server error");
    }
  };
  //create a new merchant record in the databsse
  const createBehaviorData = (body) => {
    return new Promise(function (resolve, reject) {
      const { prolificid, gif1, gif2, gif3, selected } = body;
      console.log(body)
      pool.query(
        "INSERT INTO behaviordata (prolificid, gif1, gif2, gif3, selected) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [prolificid, gif1, gif2, gif3, selected],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(
              `A new behaviordata has been added: ${JSON.stringify(results.rows[0])}`
            );
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  //delete a merchant
  // const deleteMerchant = (id) => {
  //   return new Promise(function (resolve, reject) {
  //     pool.query(
  //       "DELETE FROM merchants WHERE id = $1",
  //       [id],
  //       (error, results) => {
  //         if (error) {
  //           reject(error);
  //         }
  //         resolve(`Merchant deleted with ID: ${id}`);
  //       }
  //     );
  //   });
  // };
  //update a merchant record
  // const updateMerchant = (id, body) => {
  //   return new Promise(function (resolve, reject) {
  //     const { name, email } = body;
  //     pool.query(
  //       "UPDATE merchants SET name = $1, email = $2 WHERE id = $3 RETURNING *",
  //       [name, email, id],
  //       (error, results) => {
  //         if (error) {
  //           reject(error);
  //         }
  //         if (results && results.rows) {
  //           resolve(`Merchant updated: ${JSON.stringify(results.rows[0])}`);
  //         } else {
  //           reject(new Error("No results found"));
  //         }
  //       }
  //     );
  //   });
  // };
  module.exports = {
    getBehaviorData,
    createBehaviorData
    //deleteMerchant,
    //updateMerchant
  };