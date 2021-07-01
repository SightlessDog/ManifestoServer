const { Kafka } = require("kafkajs");

const brokers = ["192.168.0.104:9092"];
const kafka = new Kafka({ brokers });
const consumer = kafka.consumer({ groupId: "bla" });
const topic = "myTopic";

const consume = async () => {
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: ({ message }) => {
      // here, we just log the message to the standard output
      console.log(`received message: ${message.value}`);
    },
  });
};

consume().catch((err) => {
  console.error("error in consumer: ", err);
});
