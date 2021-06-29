const { Kafka } = require("kafkajs");
const {
  play,
  mute,
  playAllTracks,
} = require("../AbletonController/AbletonController");

const brokers = ["localhost:9092"];

const kafka = new Kafka({ brokers });

const consumer = kafka.consumer({ groupId: "firstPart" });
const topic = "raspi1";
const secondTopic = "raspi2";
let firstCamUsers = [];
let secondCamUsers;
let found = false;

const distanceBetweenCoords = (centerX, centerY, x, y) => {
  return (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
};

const consume = async (aoi) => {
  firstCircle = aoi.modifiedObject;
  secondCircle = aoi.secmodifiedObject;
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      let receivedMessage = JSON.parse(message.value.toString("utf-8"));
      if (receivedMessage.isEmpty) {
        console.log("No object is being tracked playing all tracks again");
        await playAllTracks();
      } else {
        found = false;
        console.log(`received message: ${message.value}`);
        let string = message.value.toString("utf-8");
        let obj = JSON.parse(string);
        obj = { ...obj, entered: false };
        if (users.length === 0) {
          if (obj.id / 10 === 1) {
            firstCamUsers.push(obj);
          } else {
            secondCamUsers.push(obj);
          }
        } else {
          if (obj.id / 10 === 1) {
            firstCamUsers.forEach((user) => {
              if (obj.id === user.id) {
                user.centerX = obj.centerX;
                user.centerY = obj.centerY;
                found = true;
              }
            });
            if (!found) {
              firstCamUsers.push(obj);
            }
          } else {
            secondCamUsers.forEach((user) => {
              if (obj.id === user.id) {
                user.centerX = obj.centerX;
                user.centerY = obj.centerY;
                found = true;
              }
            });
            if (!found) {
              secondCamUsers.push(obj);
            }
          }
        }
        if (users.length !== 0) {
          firstCamUsers.forEach(async (user) => {
            let distance = distanceBetweenCoords(
              aoi.center.x,
              aoi.center.y,
              user.centerX,
              user.centerY
            );
            if (
              distance < firstCircle.radius * firstCircle.radius ||
              (user.entered &&
                distance <
                  (firstCircle.radius + 20) * (firstCircle.radius + 20))
            ) {
              console.log("We mute track: ", user.id % 10);
              user = { ...user, entered: true };
              await mute(user.id % 10);
            } else {
              console.log("We play track: ", user.id % 10);
              await play(user.id % 10);
            }
          });
          secondCamUsers.forEach(async (user) => {
            let distance = distanceBetweenCoords(
              aoi.center.x,
              aoi.center.y,
              user.centerX,
              user.centerY
            );
            if (
              distance < secondCamUsers.radius * secondCamUsers.radius ||
              (user.entered &&
                distance <
                  (secondCamUsers.radius + 20) * (secondCamUsers.radius + 20))
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
      }
    },
  });
};

module.exports = consume;
