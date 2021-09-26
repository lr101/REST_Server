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
> ``` 
> $ CREATE USER 'USER_NAME'@'*' IDENTIFIED BY 'PASSWORD';
> $ GRANT ALL PRIVILEGES ON sensors.* TO 'USER_NAME'@'*';
> $ FLUSH PRIVILEGES;
> ```

Now we create two empty tables. Everything else can be managed later on with the web-interface:
```
$ CREATE TABLE id(sensorID char(16) NOT NULL, sensorNick char(16), sensorType int, CONSTRAINT PRIMARY KEY (sensorID));
$ CREATE TABLE types (sensorType int NOT NULL AUTO_INCREMENT, sensorTypeNick char(16),CONSTRAINT PRIMARY KEY (sensorType));
```

## Setup Sever:

### Install Server

- install [npm and node](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi) for Raspberry Pi:
- fork and pull or copy gitHub repo
- install packages in the root folder of the Project:
```
 $ cd ./REST_Server/
 $ sudo npm install http fs ejs body-parser moment morgan express mysql util path dotenv 
```
- rename file .env_sample to .env and fill in your username and psw of your db:
```
$ sudo mv .env_sample .env
$ sudo nano .env
```

Test if everything is working correctly by running the server (Cancel with Str+C):
```
$ sudo node ./server/REST_Server.js
> webapp under: [your_ip]:3000/
```

### Auto-run server and upload files:
install [PM2](https://dev.to/bogdaaamn/run-your-nodejs-application-on-a-headless-raspberry-pi-4jnn) to auto run script in background:
```
 $ sudo npm install -g pm2
 $ pm2 start ./server/REST_server.js
 $ pm2 startup systemd
```

- copy generated command and execute
```
** different for everybody: 
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/p
** save setting:
$ pm2 save
```

## Using the web-page

Sensors connected should automatically add their ID with a default name to the database. 
The webpage displays every saved sensor. Navigate to Local Sensors or click the '+' button to edit the displayed name and type.
\
\
Click on one of the square sensors or on the 'display sensors' button to view the current value as well as a graph ranging from 
1 hour to 14 days.

## Setup Thermometers:


### Microcontroller NodeMCU V.3:

//TODO
### Raspberry Pi

![grafik](https://user-images.githubusercontent.com/48615489/121551311-d1510480-ca0f-11eb-9d45-4a948329845c.png)
- solder as shown with r1 being a **4.7K Ohm resistor**
- run command and add to the bottom of the file : `dtoverlay=w1-gpio`
```
sudo nano /boot/config.txt
```
- exit file reboot raspi
```
sudo reboot
```

//TODO
- check if everything is working correctly:
```
sudo modprobe w1-therm
```




