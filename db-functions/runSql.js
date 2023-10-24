const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

let getAsync = (sql, params = []) =>{
    return new Promise((resolve, reject) => {
      db.get(sql,params, (err, row) => {
          if (err) {
              console.log(err);
              reject(err);
          }
          // console.log(row);
          resolve(row)
      });
   })
  }

let allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(rows);
        });    
    });  
};

let runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve({success: true});
        });    
    }); 
};



module.exports = {getAsync, allAsync, runAsync};