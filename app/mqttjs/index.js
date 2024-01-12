const mqtt = require('mqtt');

// const host = ('localhost');
const host = ('172.17.0.1');
// Default unencrypted MQTT port. Mosquitto connects to this automatically when run.
const port = ('1883');
const clientId = (`mqttjs_handler_${Math.random().toString(16).slice(11)}`);
// const clientId = (`mqttjs_handler`);

const connectUrl = (`mqtt://${host}:${port}`);

const getRoom = (topic) => {
  return topic.split('/')[1];
};

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
//   username: 'emqx',
//   password: 'public',
  reconnectPeriod: 1000,
});

const topic = ('zigbee2mqtt/+/temperature');

// Subscribe to topic variable on connection with MQTT URL
client.on('connect', () => {
  console.log('Connected');

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
    // Publish a test message to verify subscription is working
    // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    //   if (error) {
    //     console.error(error);
    //   }
    // });
  });
});

// Publish any messages received from the topic to the console
client.on('message', (topic, payload) => {
  const room = getRoom(topic);
  console.log(room);
  console.log(JSON.parse(payload.toString()));
});