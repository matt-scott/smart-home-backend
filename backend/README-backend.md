## Steps taken to create backend

1. Created backend folder structure

backend
    db
    config

Added .sequelizerc from old AA Open project.

2. Initialized node environment in backend folder

```shell
npm init -y
```

3. Installed dependencies

```shell
npm install  sequelize sequelize-cli pg mqtt@5.3.4
```

4. Initialized db

**Final version - change username/password/default db name?**
**Find out where and how to use env variables for production version**

```shell
npm init sequelize
```

5. Modify /config/database.json

Modify dev environment accordingly. See file

6. Create db table

example temp data
```shell
{
    timestamp: 1705299225000,
    sensor_location: 'dining',
    measurement_type: 'temperature',
    battery: 100,
    humidity: 34.48,
    linkquality: 255,
    power_outage_count: 9,
    pressure: 1022.22,
    temperature: 24.34,
    voltage: 3115
}
```
3 digits of precision possible from Aqara sensors

For decimal data type in database, specify the following for range and precision
Default for aqara appears to be 2 decimal places of precision
Pressure can change from 900 range to 1000 range for hPa reading

Pressure: (7,3) for 1234.567
Humidity: (5,3) for 12.345
Temperature: (5,3) for 12.345

```shell
npx sequelize model:generate --name temperature_sensor_data \
--attributes timestamp:date,sensor_location:string,measurement_type:string,battery:integer,humidity:decimal,linkquality:integer,power_outage_count:integer,pressure:decimal,temperature:decimal,voltage:integer
```

7. Modify migration/model files

See migration and model file for modifications to these files temperature_sensor_data


8. Create hypertable migration and modify according to file in this repo

```shell
npx sequelize migration:generate --name add_hypertable
```

9. Created docker compose.yaml to spin up timescale db

**Check on need for production env password and such**

Run migrations in db
add depends on for db in compose

## To do

**Check on bolded items in #'s 4 and 9**


**Add reverse proxy?**
https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application

**Networking in production**
Set up your own user defined network, don't use default bridge network
https://docs.docker.com/network/network-tutorial-standalone/
Set containers to talk inside docker network, or provide access to db container from outside connection?

**Build docker containers separately, store to docker hub to be imported into one compose file?**