const { Kafka } = require("kafkajs");
const {
  play,
  mute,
  playAllTracks,
} = require("../AbletonController/AbletonController");
// const { fork } = require("child_process");

const brokers = ["localhost:9092"];

const kafka = new Kafka({ brokers });

const consumer = kafka.consumer({ groupId: "firstPart" });
const topic = "raspi1";
const secondTopic = "raspi2";
let users = [];
let found = false;

const distanceBetweenCoords = (centerX, centerY, x, y) => {
  return (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
};

const consume = async (aoi) => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.on("consumer.stop", async () => {
    await playAllTracks();
  });
  await consumer.run({
    eachMessage: async ({ message }) => {
      found = false;
      console.log(`received message: ${message.value}`);
      let string = message.value.toString("utf-8");
      let obj = JSON.parse(string);
      if (users.length === 0) {
        users.push(obj);
      } else {
        users.forEach((user) => {
          if (obj.id === user.id) {
            user.centerX = obj.centerX;
            user.centerY = obj.centerY;
            found = true;
          }
        });
        if (!found) {
          users.push(obj);
        }
      }
      if (users.length !== 0) {
        users.forEach(async (user) => {
          distance = distanceBetweenCoords(
            aoi.center.x,
            aoi.center.y,
            user.centerX,
            user.centerY
          );
          if (distance < aoi.radius * aoi.radius) {
            const muted = await mute(user.id % 10);
          } else {
            const played = await play(user.id % 10);
          }
        });
      }
    },
  });
};

module.exports = consume;
