// Controller for managing items in an in-memory data store.
// Provides CRUD operations: get all items, get one item, add, update, and delete.
// Uses Joi for input validation.

const Joi = require("joi");

let dataStore = [];

const schema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).max(30).required(),
  description: Joi.string().required(),
}).unknown();

const getAllItems = async (req, res) => {
  try {
    if (dataStore.length < 1) {
      return res.status(500).send({
        message: "No item existing",
      });
    }
    res.status(200).send({ data: dataStore, message: "success" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getOneItem = (req, res) => {
  try {
    const { id } = req.params;
    const itemFound = dataStore.find((item) => item.id == id);
    console.log(itemFound);

    if (!itemFound) {
      return res.status(400).send({ message: "No item with ID found" });
    }
    return res.status(200).send({ message: "item found", data: itemFound });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const addItem = async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  // check for uniquness of id
  const existingItem = dataStore.find((item) => item.id == value.id);
  if (existingItem) {
    return res.status(400).send({ message: "item with id already exists" });
  }

  dataStore.push(value);
  return res
    .status(200)
    .send({ message: "item successfully added", data: value });
};
const updateItem = (req, res) => {
  try {
    const { id } = req.params;

    const itemIndex = dataStore.findIndex((item) => item.id == id);
    if (itemIndex === -1) {
      return res.status(400).send({ message: "item not found" });
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (id != value.id) {
      return res
        .status(400)
        .json({ message: "you are not allowed to change the id" });
    }

    dataStore[itemIndex] = req.body;
    return res
      .status(200)
      .send({ message: "update successful", data: dataStore[itemIndex] });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = dataStore.findIndex((item) => item.id == id);
    if (itemIndex === -1) {
      return res.status(400).send({ message: "item not found" });
    }
    dataStore.splice(itemIndex, 1);
    return res.status(200).send({
      message: "delete successful",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { getAllItems, getOneItem, addItem, updateItem, deleteItem };
