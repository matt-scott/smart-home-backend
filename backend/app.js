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
// host to connect to to receive MQTT data
const host = ('172.17.0.1');
// Default unencrypted MQTT port. Mosquitto connects to this automatically when run.
const port = ('1883');
const clientId = (`mqttjs_database_handler_${Math.random().toString(16).slice(11)}`);

const connectUrl = (`mqtt://${host}:${port}`);

const getSensorLocation = (topic) => {
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



// Publish any messages received from the topic to the console
client.on('message', async (topic, payload) => {



  // Build new object to publish to db
  // Turn into class or instance level method?
  // https://sequelize.org/docs/v6/core-concepts/model-basics/

  // get the current time
  const dataObject = JSON.parse(payload.toString());
  console.log(dataObject);

  const timestamp = new Date().getTime();
  const sensorLocation = getSensorLocation(topic);
  console.log(sensorLocation);


  try {

    // Refactor using spread operator. Don't need to write out all dataObject items.
    // Verify dataObject items align with the below first though
    const newDataEntryObject = temperature_sensor_data.build({
      timestamp: timestamp,
      sensor_location: sensorLocation,
      measurement_type: "temperature",
      battery: dataObject.battery,
      humidity: dataObject.humidity,
      linkquality: dataObject.linkquality,
      power_outage_count: dataObject.power_outage_count,
      pressure: dataObject.pressure,
      temperature: dataObject.temperature,
      voltage: dataObject.voltage
    });


    // // Check if tree is in the database
    // await Tree.findOne({ where: { tree: tree } }); // returns null

    // Insert the newTree instance into the database
    await newDataEntryObject.save();

    // // Check if tree is in the database
    // await Tree.findOne({ where: { tree: tree } }); // returns Tree's record

    // send response
    console.log(newDataEntryObject)
    console.log('Data inserted into db!');
  } catch (e) {
      console.log('Error inserting data into db', e)
  }

});


