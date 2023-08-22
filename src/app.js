import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import morgan from "morgan";

import cors from "cors";

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// ******************** ROUTES ******************************

app.use(
  morgan(
    '[:date[clf]] ":method :url HTTP/:http-version" :req[authorization] :status :req[content-length] req[origin]'
  )
);

if (process.env.NODE_ENV === "PRODUCTION") {
  var whitelist = [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://hopeful-list-368909.oa.r.appspot.com",
    "https://dev.aladia.io",
    "https://www.dev.aladia.io",
    "https://dev.site.aladia.io",
    "https://aladia.io",
    "http://aladia.io",
    "https://www.aladia.io",
    "http://www.aladia.io",
    "https://dashboard.stripe.com",
    "https://js.stripe.com",
    "http://192.168.150.57:3000",
    "http://93.34.232.3:3000",
    "https://aladia.stoplight.io",
  ];

  if (whitelist !== undefined) {
    const corsOptions = {
      credentials: true,
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed`));
        }
      },
    };

    app.use(cors(corsOptions));
  }
}

app.get("/service/two", async (req, res) => {
  res.status(200).json({ name: "service one", type: "testing" });
});

import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

if (!process.env.MONGO_URI) {
  throw new Error("No mongo url provided");
}
const port = process.env.PORT || 8081;

const mongoConnection = mongoose.connect(process.env.MONGO_URI);
console.log(process.env.MONGO_URI);
mongoose.createConnection(process.env.MONGO_URI).asPromise();
mongoConnection.then(() => {
  app.listen(port, () => {
    console.log(`Connected with mongoDB at ${process.env.MONGO_URI}`);
    console.table(listEndpoints(app));
    console.log(`server running on port ${port}`);
  });
});

export default app;
