const mqtt = require('mqtt');
const Sequelize = require('sequelize')
const { temperature_sensor_data } = require('../db/models')

// SEQUELIZE CONNECTION /////////////////////////////////////////////////////////////////
// Separate into its own file in future iteration

// POSTGRES_USER: matts
// POSTGRES_PASSWORD: chilicheesecake
// POSTGRES_DATABASE: sensor_data_db

// 'postgres://username:password@example.com:5432/dbname'

const sequelize = new Sequelize('postgres://matts:chilicheesecake@localhost:5432/sensor_data_db',
  {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
          // ssl: {
          //     require: true,
          //     rejectUnauthorized: false
          // }
      }
  })

sequelize.authenticate().then(() => {
      console.log('Connection has been established successfully.');
  }).catch(err => {
      console.error('Unable to connect to the database:', err);
  });

  

// MQTT CONNECTION /////////////////////////////////////////////////////////////////////
// Separate into its own file in future iteration

// const host = ('localhost');
const host = ('172.17.0.1');
// Default unencrypted MQTT port. Mosquitto connects to this automatically when run.
const port = ('1883');
const clientId = (`mqttjs_database_handler_${Math.random().toString(16).slice(11)}`);

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

// FILE FUNCTIONS /////////////////////////////////////////////////////////////////////
// What this file is actually doing

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

// Function to build db object
// Turn into class or instance level method?
// https://sequelize.org/docs/v6/core-concepts/model-basics/
const dbObjectBuilder = () => {

};

// Publish any messages received from the topic to the console
client.on('message', async (topic, payload) => {
  const room = getRoom(topic);
  console.log(room);
  console.log(JSON.parse(payload.toString()));

  const objectDeliverable = dbObjectBuilder(topic, payload);

  // get the current time
  const time = new Date().getTime();

  try {
      // insert the record
      await PageLoads.create({
          userAgent, time
      });

      // send response
      console.log('Message inserted into db!');
  } catch (e) {
      console.log('Error inserting data into db', e)
  }

});


