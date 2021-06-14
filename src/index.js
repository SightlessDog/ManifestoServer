const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const consume = require("./KafkaConsumer/kafkaConsumer");
const { loadTracks } = require("./AbletonController/AbletonController");

const app = express();

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let aoi = {};

//start your server on port 3001
app.listen(8080, () => {
  console.log("Server Listening on port 8080");
});

app.get("/", function (req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
});

app.post("/", function (req, res) {
  aoi = req.body.aoi;
  loadTracks()
    .then(
      consume(aoi).catch((err) => {
        console.error("error in consumer: ", err);
      })
    )
    .catch(() => {
      console.error("Error loading tracks");
    });
});
