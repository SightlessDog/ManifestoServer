const { Kafka } = require("kafkajs");
const {
  play,
  mute,
  playAllTracks,
} = require("../AbletonController/AbletonController");

const brokers = ["192.168.0.104:9092"];

const kafka = new Kafka({ brokers });

const consumer = kafka.consumer({ groupId: "firstPart" });
const topic = "raspi1";
const firstArea = { empty: false, duration: 0 };
const secondArea = { empty: false, duration: 0 };
let firstCamUsers = [];
let secondCamUsers = [];
let found;

const distanceBetweenCoords = (centerX, centerY, x, y) => {
  return (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
};

const evaluate = async (message, circle, users) => {
  found = false;
  if (users.length === 0) {
    users.push(message);
  } else {
    users.forEach((user) => {
      if (message.id === user.id) {
        user.centerX = message.centerX;
        user.centerY = message.centerY;
        found = true;
      }
    });
    if (!found) {
      users.push(message);
    }
  }
  if (users.length !== 0) {
    console.log("[DEBUG] inside evaluate circle", circle);
    users.forEach(async (user) => {
      let distance = distanceBetweenCoords(
        circle.center.x,
        circle.center.y,
        user.centerX,
        user.centerY
      );
      if (
        distance < circle.radius * circle.radius ||
        (user.entered && distance < (circle.radius + 20) * (circle.radius + 20))
      ) {
        console.log("We mute track: ", user.id % 10);
        user = { ...user, entered: true };
        await mute(user.id % 10);
      } else {
        console.log("We play track: ", user.id % 10);
        await play(user.id % 10);
      }
    });
  }
};

const consume = async (circles) => {
  const firstCircle = circles.modifiedObject.aoi;
  const secondCircle = circles.secmodifiedObject.aoi;
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      let receivedMessage = JSON.parse(message.value.toString("utf-8"));
      if (receivedMessage.isEmpty) {
        console.log("No object is being tracked");
        if (receivedMessage.id === 1) {
          console.log("Dealing with the first empty space");
          firstArea.duration = firstArea.duration + 1;
          firstArea.empty = true;
          console.log("DEBUG first area", firstArea);
        } else {
          console.log("Dealing with the second empty space");
          secondArea.duration = secondArea.duration + 1;
          secondArea.empty = true;
        }

        if (
          firstArea.empty &&
          firstArea.duration > 10 &&
          secondArea.empty &&
          secondArea.duration > 10
        ) {
          console.log("We waited enough now we are gonna play all tracks");
          await playAllTracks();
        }
      } else {
        console.log(`received message: ${message.value}`);
        let string = message.value.toString("utf-8");
        let obj = JSON.parse(string);
        obj = { ...obj, entered: false };
        found = false;
        if (obj.id / 10 === 1) {
          console.log("[INFO] sending to the first handler");
          firstArea.duration = 0;
          firstArea.empty = false;
          evaluate(obj, firstCircle, firstCamUsers);
        } else {
          console.log("[INFO] sending to the second handler");
          secondArea.duration = 0;
          secondArea.empty = false;
          evaluate(obj, secondCircle, secondCamUsers);
        }
      }
    },
  });
};

module.exports = consume;
