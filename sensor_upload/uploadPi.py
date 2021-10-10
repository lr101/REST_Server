import requests
import os
import sys
import time
from datetime import datetime

host = "192.168.0.27:3000"
numberMeasurements = 10
tempSensorBezeichnung = []  # Array mit Sensorname
tempSensorAnzahl = 0  # Anzahl sensoren
tempSensorWert = []  # Sensorwerte


def ds1820einlesen():
    global tempSensorBezeichnung, tempSensorAnzahl, programmStatus
    try:
        for x in os.listdir("/sys/bus/w1/devices"):
            if (x.split("-")[0] == "28") or (x.split("-")[0] == "10"):  # Pruefung ob name ein sensor sein kann
                tempSensorBezeichnung.append(x)
                tempSensorAnzahl = tempSensorAnzahl + 1
    except:
        print("Der Verzeichnisinhalt konnte nicht ausgelesen werden.")


def ds1820auslesen():
    global tempSensorBezeichnung, tempSensorAnzahl, tempSensorWert, programmStatus
    x = 0
    tempSensorWert = []
    try:
        # 1-wire Slave Dateien gem. der ermittelten Anzahl auslesen
        while x < tempSensorAnzahl:  # WerteArray auf anzahl Sensoren vorbereiten (zwei demensional)
            tempSensorWert.append([])
            x = x + 1
        x = 0
        for m in range(numberMeasurements):  # zehn Messungen
            while x < tempSensorAnzahl:  # pro Messung alle Sensoren einmal abfragen
                dateiName = "/sys/bus/w1/devices/" + tempSensorBezeichnung[x] + "/w1_slave"
                file = open(dateiName)
                filecontent = file.read()
                file.close()  # Temperaturwerte auslesen und konvertieren
                stringvalue = filecontent.split("\n")[1].split(" ")[9]
                sensorwert = float(stringvalue[2:]) / 1000
                temperatur = '%6.2f' % sensorwert  # Sensor- bzw. Temperaturwert auf 2 Dezimalstellen formatiert
                tempSensorWert[x].append(temperatur)  # Wert in Liste hinzufuegen
                x = x + 1
            x = 0
    except:
        # Fehler bei Auslesung der Sensoren
        print("ERROR")


try:
    if tempSensorBezeichnung is not []:
        ds1820einlesen()  # Vorhandene Sensoren einmalig abfragen
        for sensorID in tempSensorBezeichnung:
            requests.post("http://" + host + "/sensors/id/", json={"sensorID": sensorID.split("-")[0]+sensorID.split[1], "sensorNick": "newSensor"},timeout=2.50)

        while True:
            ds1820auslesen()  # auslesen wird eingeleitet
            for sensorID in tempSensorBezeichnung:
                    ergebnis = 0
                    for value in tempSensorWert:  # Bilden des Durchschnitts der gemessenen Werte
                        ergebnis += float(value)
                    ergebnis /= len()
                    print(ergebnis)
                    requests.post("http://" + host + "/sensors/" + sensorID.split("-")[0]+sensorID.split[1],json={"value": ergebnis, "date": "no_date"}, timeout=2.50)
            time.sleep(20)
            print("cycle complete")
except:
    time.sleep(20)
