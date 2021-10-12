# Setup Raspberry Pi as Access Point / Wi-Fi Repeater

- I used [this](https://www.raspberryconnect.com/projects/65-raspberrypi-hotspot-accesspoints/168-raspberry-pi-hotspot-access-point-dhcpcd-method) tutorial for reference
- Make sure to have the setup process of your database and web server completed before doing this due to no internet access after completing setup.
### Installation

- Install needed Software (press 'y' when asked):
```
  sudo apt-get install hostapd
  sudo apt-get install dnsmasq
```
- and deactivate them for the setup process:
```
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```
### Hostapd Configuration
- Open config file:
```
sudo nano /etc/hostapd/hostapd.conf
```
- Insert:
```
interface=wlan0
driver=nl80211
ssid=RPiHotSpot #TODO Enter your Wifi name here
hw_mode=g
channel=6 #Change the channel here if there is to much interference
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=PASSWORD #TODO enter your password here
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```
- Save file and open the next config file:
```
sudo nano /etc/default/hostapd
```
- change #DAEMON_CONF="" to (make sure # is removed and therefore uncommented:
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
- check that DAEMON_OPTS="" is proceeded by a # and therefore commented out
- Startup Hostapd:
```
    sudo systemctl unmask hostapd
    sudo systemctl enable hostapd
```
### DNSmasq Configuration
- open config file:
```
sudo nano /etc/dnsmasq.conf
```
- add at the bottom:
```
interface=wlan0
domain-needed
bogus-priv
dhcp-range=192.168.50.150,192.168.50.200,255.255.255.0,12h
```
### Interface Configuration
- open:
```
sudo nano /etc/network/interfaces
```
remove all access lines if more are shown than these five lines:
```
# interfaces(5) file used by ifup(8) and ifdown(8)
# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'
# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d
```
- update dhcpcd.conf file, open and add at the bottom:
```
sudo nano /etc/dhcpcd.conf

nohook wpa_supplicant
interface wlan0
static ip_address=192.168.50.10/24 #your IP Adress of the Raspberry 
static routers=192.168.50.1
```
- TODO: enable DNSmasq again?
- after rebooting your raspberry pi, the Wi-Fi Network should be visible 
