const { Kafka } = require("kafkajs");
const { play, mute } = require("../AbletonController/AbletonController");

const brokers = ["localhost:9092"];

const kafka = new Kafka({ brokers });
const consumer = kafka.consumer({ groupId: "firstPart" });

let users = [];
let total = 0;
let newTotal = 0;
let found = false;

const distanceBetweenCoords = (centerX, centerY, x, y) => {
  return (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
};

const consume = async (aoi, topic) => {
  total = newTotal;
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      newTotal++;
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
            const muted = await play(user.id);
          } else {
            const played = await mute(user.id);
          }
        });
      }
    },
  });
  if (total == newTotal) {
    await playAllTracks();
  }
};

process.on("message", (message) => {
  const result = consume(message.aoi, message.topic);
  process.send(result);
});
