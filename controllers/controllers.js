const { json } = require("body-parser");
const mysql = require("mysql");
var constants = require('../constants/constants.js');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "livequery",
});

const getMain = async (req, res) => {
  await parseInitial();
  db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connection Successful");
  });
  res.json({ status: "OK", method: "GET", url: "/" });
};


const getProducts = async (req, res) => {
  let sql = `SELECT * FROM products`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
  //res.json({ status: "OK", method: "GET", url: "/messages" });
};

const getOrders = async (req, res) => {
  let sql = `SELECT * FROM orders`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
  //res.json({ status: "OK", method: "GET", url: "/messages" });
};

const getOrder = async (req, res) => {
  let sql=`SELECT * FROM orders WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};


const postOrders = async (req, res) => {
  let data = req.body;
  let sql = "INSERT INTO orders SET?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    updateStream(result);
    res.send(result);
  });
};

async function updateStream(data) {
  const Stream = Parse.Object.extend("Stream");
  const stream = new Stream();
  let newData = data;
  console.log("Parse Server Stream Data:" + newData.insertId);
  let sql = `SELECT * FROM orders WHERE id=${newData.insertId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    newData = results;
    stream.set("data", newData);
    stream.save().then(async (stream) => {
      console.log("New Object Created With objectId: " + stream.id);
      sleep(5000).then(() => {
        console.log("WAKE UP");
        deleteStream(stream.id);
      });
    });
  });
}

async function parseInitial() {
  try {
    Parse.initialize(
      constants.APP_ID,
      constants.JS_KEY,
    );
    Parse.serverURL = constants.SV_URL;
    console.log("Parse Server Connection Successful");
  } catch (err) {
    console.log("Parse Server Connection Failed:" + err);
  }
}



function deleteStream(data) {
  let objectId = data;
  const Stream = Parse.Object.extend("Stream");
  const stream = new Stream();
  stream.set("objectId", objectId);
  stream.destroy().then((e) => {
    console.log("Delete objectId:" + e.id);
  });
}

function sleep(ms) {
  console.log("Sleeping: " + ms + " ms");
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  getMain,
  getProducts,
  getOrders,
  getOrder,
  postOrders,
};
