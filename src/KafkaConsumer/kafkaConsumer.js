const { Kafka } = require("kafkajs");
const { play, mute } = require("../AbletonController/AbletonController");
const { fork } = require("child_process");

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
  const firstChild = fork(__dirname + "/processor");
  // const secondChild = fork(__dirname + "/processor");
  firstChild.send({ aoi, topic });
};

module.exports = consume;
