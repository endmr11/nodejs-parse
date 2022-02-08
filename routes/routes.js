const express = require("express");
const router = express.Router();
var ParseServer = require("parse-server").ParseServer;
const controller = require("../controllers/controllers.js");

//Tüm Verileri Getirme
router.get("/", controller.getMain);
router.get("/products", controller.getProducts);
router.post("/orders",controller.postOrders);
router.get("/orders",controller.getOrders);
router.get("/orders/:id",controller.getOrder);
module.exports = router;
