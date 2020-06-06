**Servidor creado con nodejs para manejar en remoto un coche teledirigido**

Para poder utilizar el coche desde cualquier dispositivo es recomendable disponer de una interfaz WiFi que se pueda usar como punto de acceso, y seguir los siguientes pasos.

1. Instalar dnsmasq y hostapd
`sudo apt install dnsmasq hostapd`
como la configuración no esta todavia diponible detenemos los servicios
`sudo systemctl stop dnsmasq`
`sudo systemctl stop hostapd`

2. Configurar una ip estática
`sudo nano /etc/dhcpcd.conf`
al final de este archivo añadimos, wlan0 pueden ser otra interface
```
    interface wlan0
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
```
reiniciar el servicio dhcp y cargar la config de wlan0

3. Configurar el servidor DHCP (dnsmasq)
editar el archivo /etc/dnsmasq.conf y añadir lo siguiente
```
    interface=wlan0
    dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
```
y recargamos dnsmasq
`sudo systemctl reload dnsmasq`

4. Configurar el software de punto de acceso (hostapd)
`sudo nano /etc/hostapd/hostapd.conf`
y añadir lo siguiente, ciertos parametro se pueden o deben cambiar. Y el nombre de la red y la contraseña no deben ser envueltas entre comillas.
```
    interface=wlan0
    driver=nl80211
    ssid=NameOfNetwork
    hw_mode=g
    channel=7
    wmm_enabled=0
    macaddr_acl=0
    auth_algs=1
    ignore_broadcast_ssid=0
    wpa=2
    wpa_passphrase=AardvarkBadgerHedgehog
    wpa_key_mgmt=WPA-PSK
    wpa_pairwise=TKIP
    rsn_pairwise=CCMP
```
editamos el archivo del sistema que indica donde se encuentra esta información
`sudo nano /etc/default/hostapd`
Y en la linea #DAEMON_CONF la reemplazamos con esto
`DAEMON_CONF="/etc/hostapd/hostapd.conf"`
y activamos hostapd
```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
```

[text](https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md)
