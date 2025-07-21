/**
 * Project Documentation: Node.js E-commerce API
 *
 * Overview:
 * This project is a RESTful API for a simple e-commerce platform built with Node.js, Express, and MongoDB.
 * It supports user registration, authentication, product management, and role-based access control.
 *
 * Features:
 * - User registration and login with JWT authentication
 * - Role-based authorization (admin/customer)
 * - CRUD operations for products (admin only for create/delete)
 * - Secure password hashing with bcrypt
 * - Input validation using Joi
 * - Modular middleware for authentication
 *
 * Setup Instructions:
 * 1. Clone the repository.
 * 2. Install dependencies: `npm install`
 * 3. Create a `.env` file with the following variables:
 *    - DB_URL=<your_mongodb_connection_string>
 *    - PORT=<your_desired_port>
 *    - JWT_KEY=<your_jwt_secret>
 * 4. Start the server: `node server.js`
 *
 * API Endpoints:
 * - POST /auth/register: Register a new user (admin/customer)
 * - POST /auth/login: Authenticate user and receive JWT
 * - GET /products: Retrieve all products
 * - POST /products: Add a new product (admin only)
 * - DELETE /products/:id: Delete a product (admin only)
 *
 * Node.js Scalability:
 * - Asynchronous I/O: All database and authentication operations use async/await, allowing non-blocking requests and efficient resource usage.
 * - Modular Design: Middleware and schema separation enable easy extension and maintenance.
 * - Stateless API: JWT-based authentication allows horizontal scaling (multiple server instances) without session sharing.
 * - MongoDB Integration: Supports large datasets and concurrent access, suitable for scalable applications.
 * - Environment Configuration: Uses environment variables for flexible deployment across different environments.
 *
 * This project demonstrates how Node.js can handle multiple concurrent requests efficiently, making it suitable for scalable web services.
 */

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const verifyToken = require("./middleware/checkAuth");

const userModel = require("./schema/user");
const productModel = require("./schema/product");

const app = express();
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connected to the db");
  })
  .catch((err) => {
    console.log("An error occurred:", err);
  });

const PORT = process.env.PORT;

app.use(express.json());

// user registration
app.post("/auth/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // validate role
    const schema = joi.string().valid("admin", "customer");
    const { error } = schema.validate(role);
    if (error) {
      res.status(422).send({ message: error.message });
      return;
    }

    // check if email already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      res.status(400).send({ message: "email already exists" });
      return;
    }

    const hashedPwd = bcrypt.hashSync(password, 10);

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPwd,
      role,
    });

    res
      .status(200)
      .send({ message: `New ${role} added successfully`, newUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unable to create User" });
  }
});

// user login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await userModel.findOne({ email });

  if (!userDetail) {
    res
      .status(404)
      .send({ message: `No registered user with email: ${email}` });
    return;
  }

  const passwordCheck = bcrypt.compareSync(password, userDetail.password);

  if (!passwordCheck) {
    return res.status(401).send({ message: "invalid credentials" });
  }

  const token = jsonwebtoken.sign(
    {
      userId: userDetail.id,
      email: userDetail.email,
      role: userDetail.role,
    },
    process.env.JWT_KEY
  );

  res.status(200).send({
    message: "Login successful",
    token,
    userDetail: {
      fullName: userDetail.fullName,
      role: userDetail.role,
    },
  });
});

// get all products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await productModel.find();
    if (allProducts.length < 1) {
      res.send("No products available");
      return;
    }
    res.send(allProducts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// add new product

app.post("/products", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Only admins can add products" });
  }

  const { productName, cost, productImages, description, stockStatus } =
    req.body;

  try {
    const newProduct = await productModel.create({
      productName,
      cost,
      productImages,
      description,
      stockStatus,
      ownerId: req.user.userId,
    });

    res.status(201).send({ message: "Product created", newProduct });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// admin delete product
app.delete("/products/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Only admins can delete products" });
  }

  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send({ message: "Product deleted", deleted });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
