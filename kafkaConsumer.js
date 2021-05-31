const { Kafka } = require("kafkajs");

const brokers = ["localhost:9092"];

const kafka = new Kafka({ brokers });

const consumer = kafka.consumer({ groupId: "firstPart" });
const topic = "raspi1";

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: ({ message }) => {
      console.log(message);
      console.log(`received message: ${message.value}`);
    },
  });
};

module.exports = consume;
