# gaia
multipurpose temperature and humidity manager

Open the terminal on your Raspberry Pi and run the following commands:

git clone https://github.com/adafruit/Adafruit_Python_DHT.git
cd Adafruit_Python_DHT

This will clone the Adafruit Python Library to your Pi

To make sure you have the correct dependencies to use the library, you’ll also need to run these commands:

sudo apt-get update
sudo apt-get install build-essential python-dev python-openssl

Next you’ll need to install the library we cloned earlier:

sudo python setup.py install

To confirm that you’ve successfully installed the library, test the sensor by navigating to the Examples folder and running the test python script:

cd examples
sudo ./AdafruitDHT.py 11 4

This tests pin GPIO 4 for the DHT11 sensor and returns the temperature and humidity values.
