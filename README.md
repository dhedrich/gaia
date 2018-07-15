# gaia
Multipurpose temperature and humidity manager. For use with Raspbian on Raspberry Pi 3 and DHT11 temperature and humidity sensor. Monitors local temperature and realitve humidity, and will alert user via email when either measurement is out of the user's specifed ranges.

# Installing  Adafruit Python Library
Open the terminal on your Raspberry Pi and run the following commands:

`git clone https://github.com/adafruit/Adafruit_Python_DHT.git`

`cd Adafruit_Python_DHT`

This will clone the Adafruit Python Library to your Pi

To make sure you have the correct dependencies to use the library, you’ll also need to run these commands:

`sudo apt-get update`

`sudo apt-get install build-essential python-dev python-openssl`

Next you’ll need to install the library we cloned earlier:

`sudo python setup.py install`

To confirm that you’ve successfully installed the library, test the sensor by navigating to the Examples folder and running the test python script:

`cd examples`

`sudo ./AdafruitDHT.py 11 4`

This tests pin GPIO 4 for the DHT11 sensor and returns the temperature and humidity values.

# Installing Node on RPi
Update Debian apt package reposity to include NodeSource packages:

`curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`

Install Node.js:

`sudo apt-get install -y nodejs`

# Installing and Configuring MongoDB on RPi

Install MongoDB server:

`sudo apt-get install mongodb`

You will need to create a /data/db directory in order for databases to be saved. From /home/pi directory:

`cd ../..`

`sudo mkdir data`

`cd data`

`sudo mkdir db`

`cd ~`

Kill all running MongoDB processes and reset mongod instance before starting:

`sudo service mongodb stop`

`sudo mongod --repair`

Start MongoDB server (default port is 27017):

`sudo mongod`

#Starting Node Server

After cloning this repo, enter the cloned directory and start node server:

`cd gaia`

`node server.js`

This will initialize the server on port 3000. Upon initialization, temperature and humidity readings will be taken once every 15 minutes and stored in the database.

Visit `localhost:3000` to access the Gaia interface. Gaia will display the current temperature and humidity at the top, as well as a table of the 10 most recent sensor readings. A full history of sensor readings can be accessed at `localhost:3000/fullhistory`.

The user may enter an email address as well as acceptable ranges for temperature and humidity in the form at the bottom of the page. The server will send an alert to this email addresss upon taking a reading that is outside of these specified ranges.
