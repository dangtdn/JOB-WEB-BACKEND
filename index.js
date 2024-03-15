import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./src/Middlewares/error.js";
import cookieParser from "cookie-parser";
import route from "./src/routes/index.js";
import database from "./src/utils/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());

//ROUTES MIDDLEWARE
route(app);

// error middleware
app.use(errorHandler);

//database connection
database();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
