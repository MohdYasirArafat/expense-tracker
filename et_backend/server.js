const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route.js");
const expenseRouter = require("./routes/expense.route.js");
const cors = require("cors")
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));

// server.js (Double check this configuration)
// server.js (Replace your current app.use(cors(...)) with this block)
// const cors = require("cors");

// Define an array of all allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",                              // Local Development URL
  "http://127.0.0.1:5173",                            // Alternative Local Host mapping
  "https://expense-tracker-frontend-zaxy.onrender.com" // Live Production Frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    credentials: true, // Crucial to allow reading/writing HttpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);
;


app.use('/api/user',userRouter);
app.use('/api/expense',expenseRouter);

app.get("/",(req,res)=>{
    res.send("server is running peroperly ")
    
})

app.listen(PORT, ()=>{
    console.log(`server start at http://localhost:${PORT}`);
})