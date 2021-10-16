# For Raspberry Pi:

## [Setup MySql Database](https://pimylifeup.com/raspberry-pi-mysql/)

Execute the following commands to install MYSQL:
```
$ sudo apt install mariadb-server
$ sudo mysql_secure_installation
```
To access the database use:

```
$ sudo mysql -u root -p
```
First thing to do is to create a database and a user:
```
$ CREATE DATABASE sensors;
$ CREATE USER 'USER_NAME'@'localhost' IDENTIFIED BY 'PASSWORD';
$ GRANT ALL PRIVILEGES ON sensors.* TO 'USER_NAME'@'localhost';
$ FLUSH PRIVILEGES;
```
>Note: This works only for users on the same device > Webserver must run on same device.
> Only way to change it, is to [enable networking](https://stackoverflow.com/questions/18733802/how-do-i-open-up-my-mysql-on-my-raspberry-pi-for-outside-remote-connections) and Grant all devices access:
> On my raspberry pi nano: comment '# bind-address = 127.0.0.1' out in the file :
> ```
> $ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
> ```
> ``` 
> $ CREATE USER 'USER_NAME'@'*' IDENTIFIED BY 'PASSWORD';
> $ GRANT ALL PRIVILEGES ON sensors.* TO 'USER_NAME'@'*';
> $ FLUSH PRIVILEGES;
> ```

Now we create two empty tables. Everything else can be managed later on with the web-interface:
```
$ USE sensors;
$ CREATE TABLE id(sensorID varchar(16) NOT NULL, sensorNick varchar(16), sensorTypeID int DEFAULT 0, CONSTRAINT PRIMARY KEY (sensorID));
$ CREATE TABLE types (sensorTypeID int NOT NULL AUTO_INCREMENT, sensorType varchar(16), unit varchar(5) DEFAULT 'dUnit', repetitions INT DEFAULT 10, sleepTime INT DEFAULT 200, CONSTRAINT PRIMARY KEY (sensorTypeID));
$ INSERT INTO types (sensorType, unit) VALUES ('default', 'dUnit');
$ UPDATE types SET sensorTypeID=0 WHERE sensorType='default';
```

## Setup Sever:

### Install Server

- install [npm and node](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi) for Raspberry Pi:
``` 
- ONLY FOR RASPBERRY NANO: wget https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.gz
- ONLY FOR RASPBERRY 3B+ : //TODO
tar -xzf node-v11.15.0-linux-armv6l.tar.gz
cd node-v11.15.0-linux-armv6l/
sudo cp -R * /usr/local/
```
- check if the installation worked correctly:
```
node -v
node -v
```
- install git:
```
 $ sudo apt install git
```
- clone or copy gitHub repo:
```
 $ sudo git clone https://github.com/lr101/REST_Server.git
```
- install packages in the root folder of the Project:
```
 $ cd ./REST_Server/
 $ sudo npm install http fs ejs body-parser moment morgan express mysql util path dotenv 
```
- rename the file .env_sample to .env and fill in your username and psw of your db:
```
$ sudo mv .env_sample .env
$ sudo nano .env
```

Test if everything is working correctly by running the server (Cancel with Strg+C):
```
$ sudo node ./server/REST_Server.js
> webapp under: [your_ip]:3000/
```

### Auto-run server and upload files:
install [PM2](https://dev.to/bogdaaamn/run-your-nodejs-application-on-a-headless-raspberry-pi-4jnn) to auto run script in background:
```
 $ sudo npm install -g pm2
 $ sudo pm2 start ./server/REST_Server.js
 $ sudo pm2 startup systemd
```

- copy generated command and execute
```
** different for everybody: 
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/p
** save setting:
$ sudo pm2 save
```

## Using the web-page

Sensors connected are supposed to add their ID with a default name to the database automatically. THis is done by sending a
http POST request to the webserver on the following address: **http://[ip]:3000/sensors/id/**. Further documentation on the implemented
REST-API and how to use it can be found under .REST-API.txt\
\
The webpage displays every saved sensor. Navigate to /config/local-sensors or click the big '+' button to edit the displayed name and type.
\
\
To edit the name of a sensorType and its unit. Navigate to /config/sensor-types and.
\
\
Click on one of the square sensors or on the 'display sensors' button to view the current value as well as a graph with ranging values from 
1 hour to 14 days.

## Setup Thermometers:


### [Microcontroller NodeMCU V.3](https://www.amazon.de/AZDelivery-NodeMCU-Lolin-WiFi-Parent/dp/B07Z5C3KQF):

- based on [this](https://randomnerdtutorials.com/esp8266-ds18b20-temperature-sensor-web-server-with-arduino-ide/) and [this](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/) tutorial

![grafik](https://i2.wp.com/randomnerdtutorials.com/wp-content/uploads/2019/07/ds18b20_esp8266_multiple_bb.png?w=1020&quality=100&strip=all&ssl=1)
- solder ds18b20 temperatur sensors to pins (blue = data, red = power, black = ground) with a **4.7K Ohm resistor**
- install drivers by checking the back of your Microcontroller. A driver install page should be printed there.
- install [Arduino IDE](https://www.arduino.cc/en/software)
- to add this bord as supported bord go to: File &#8594; Preferences
- enter in **Additional Board Manager URLs**; https://dl.espressif.com/dl/package_esp32_index.json
- go to Tools &#8594; Board &#8594; Board Manager and search for ESP32 and install
- go to Tools &#8594; Board &#8594; NodeMCU V1 (ESP-12E) and select
- to interface with the ds18b20 sensors the **One wire Library by Paul Stoffregen** and **Dallas Temperature library** are needed. Install under Sketch &#8594; Include Library &#8594; Manage Library
- open the file uploadESP8266_sample.ino in the Arduino IDE
- connect your NodeMCU V3 via USB Cable to your PC
- select the correct COM-Port under Tools &#8594; Port
- fill in the TODO spots with your own data
- press Upload to flash your Microcontroller

### Raspberry Pi

![grafik](https://user-images.githubusercontent.com/48615489/121551311-d1510480-ca0f-11eb-9d45-4a948329845c.png)
- solder as shown with r1 being a **4.7K Ohm resistor**
- run command and add to the bottom of the file : `dtoverlay=w1-gpio`
```
sudo nano /boot/config.txt
```
- exit file reboot raspberry pi
```
sudo reboot
```

//TODO
- check if everything is working correctly:
```
sudo modprobe w1-therm
```
- copy or move the file uploadPi.py to your home directory
```
sudo mv uploadPi.py ~/
```
- insert your own data in the given TODOs
- add the file to your pm2 start list and save:
```
sudo pm2 start uploadPi.py
sudo pm2 save
```



