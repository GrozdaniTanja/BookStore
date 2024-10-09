let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cors = require("cors");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
const port = 3001;

let usersRouter = require("./routes/users");
let booksRouter = require("./routes/books");
let ordersRouter = require("./routes/orders");
let authRouter = require("./routes/auth");
const connectDB = require("./database/db");

let app = express();

const corsOptions = {
  origin: [
    "https://book-store-frontend-delta-tawny.vercel.app", // vercel deployment
    "http://localhost:3000", // local react app
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
connectDB();

app.use("/users", usersRouter);
app.use("/books", booksRouter.router);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    console.log('Request received:', req.method, req.path);
    next();
  });
  

app.use(function (req, res, next) {
  res.status(404).json({ error: "Route not found" });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
