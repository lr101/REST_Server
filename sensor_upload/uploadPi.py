# IMPORTANT: this file has to be in your devices home directory to work (~/)

import requests
import os
import sys
import time
from datetime import datetime

host = "[HOST_IP]:3000" #TODO: add the ip Address of your web Server (often just localhost)
numberMeasurements = 10
tempSensorBezeichnung = []  # Array with sensorID names
tempSensorAnzahl = 0  # number of sensors
tempSensorWert = []  # array of measured temperatures


def ds1820einlesen():
    global tempSensorBezeichnung, tempSensorAnzahl, programmStatus
    try:
        for x in os.listdir("/sys/bus/w1/devices"):
            if (x.split("-")[0] == "28") or (x.split("-")[0] == "10"):  # check if name matches sensorID criteria
                tempSensorBezeichnung.append(x)
                tempSensorAnzahl = tempSensorAnzahl + 1
    except:
        print("Could not read directory")


def ds1820auslesen():
    global tempSensorBezeichnung, tempSensorAnzahl, tempSensorWert, programmStatus
    x = 0
    tempSensorWert = []
    try:
        while x < tempSensorAnzahl:  # make array two dimensional with the amount of sensors connected
            tempSensorWert.append([])
            x = x + 1
        x = 0
        for m in range(numberMeasurements):  # take amount of predefined measurements
            while x < tempSensorAnzahl:
                dateiName = "/sys/bus/w1/devices/" + tempSensorBezeichnung[x] + "/w1_slave"
                file = open(dateiName)
                filecontent = file.read()
                file.close()
                stringvalue = filecontent.split("\n")[1].split(" ")[9]
                sensorwert = float(stringvalue[2:]) / 1000
                temperatur = '%6.2f' % sensorwert  # format to have two decimal digits
                tempSensorWert[x].append(temperatur)  # add value to array
                x = x + 1
            x = 0
    except:
        # Couldn't read directory
        print("ERROR")


try:
    if tempSensorBezeichnung is not []:
        ds1820einlesen()  # get sensors
        for sensorID in tempSensorBezeichnung:
            # POST sensorID's to web Server
            requests.post("http://" + host + "/sensors/id/", json={"sensorID": sensorID.split("-")[0]+sensorID.split("-")[1], "sensorNick": "newSensor"},timeout=2.50)

        while True:
            ds1820auslesen()  # get a measurement
            id = 0
            for sensorID in tempSensorBezeichnung:
                    ergebnis = 0
                    for value in tempSensorWert[id]:  # calculate average
                        ergebnis += float(value)
                    ergebnis /= len(tempSensorWert[id])

                    # POST measurement to web server
                    requests.post("http://" + host + "/sensors/" + sensorID.split("-")[0]+sensorID.split("-")[1],json={"value": ergebnis, "date": "no_date"}, timeout=2.50)
            # pause for 20 sec.
            time.sleep(20)
            print("cycle complete")
except:
    #Couldn reach web server
    time.sleep(20)

