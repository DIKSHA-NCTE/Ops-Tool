from datetime import datetime
import requests
import token_generate
import os
import time
import logging
from configparser import ConfigParser

config = ConfigParser()
config.read('location_config.ini')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
f = logging.Formatter('%(asctime)-15s - %(levelname)s - %(message)s')
fh = logging.FileHandler('../log/location_upload'+datetime.now().strftime('%H_%M_%d_%m_%Y')+'.log')
fh.setFormatter(f)
logger.addHandler(fh)

# List of files needs to be passed
file_path = ["<List of files to upload>"]

# Endpoint of the location upload API
url = token_generate.host + config['API']['location_upload']
payload = {'type': 'school'}
headers = {
    'Authorization': token_generate.auth_token,
    'x-authenticated-user-token': token_generate.user_token
}
for file in file_path:
    filename = os.path.basename(file)
    files = [('file', (filename, open(file, 'rb'), 'text/csv'))]
    response = requests.request("POST", url, headers=headers, data=payload, files=files, timeout=30).json()
    logger.info([file, response])
    print(file, "-", response)
    if file != file_path[-1:][0]:
        time.sleep(30)
