# Zigbee2MQTT / Mosquitto / MQTT.js Docker Configuration

Working configuration for running a backend to store MQTT sensor data into a timescaleDB, Postgres database. Includes a Zigbee2MQTT client container, Mosquitto broker container, timescaleDB container, and Node container (with MQTT.js client, sequelize).

Architecture shown below

![Hardware Integration](https://github.com/matt-scott/backend-docker/blob/main/Hardware%20Integration.png?raw=true)

![Software Architecture](https://github.com/matt-scott/backend-docker/blob/main/Software%20Architecture.png?raw=true)
