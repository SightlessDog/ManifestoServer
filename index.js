const consume = require("./kafkaConsumer");

consume().catch((err) => {
  console.error("error in consumer: ", err);
});
