const express = require("express");
const itemRouter = require("./routers/itemRouter");

const app = express();

const PORT = 3000;

app.use(express.json());

// Catch-all for unknown routes

app.use("/items", itemRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
