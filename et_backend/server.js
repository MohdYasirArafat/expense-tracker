const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route.js");
const expenseRouter = require("./routes/expense.route.js");
const cors = require("cors");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/expense", expenseRouter);

app.get("/", (req, res) => {
  res.send("server is running peroperly ");
});

app.listen(PORT, () => {
  console.log(`server start at http://localhost:${PORT}`);
});
