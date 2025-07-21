const express = require("express");
const {
  getAllItems,
  getOneItem,
  addItem,
  updateItem,
  deleteItem,
} = require("./itemController");

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getOneItem);
router.post("/", addItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
