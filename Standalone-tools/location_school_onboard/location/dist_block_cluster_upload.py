import os
import requests
import token_generate
import time
import logging
from datetime import datetime
from configparser import ConfigParser

config = ConfigParser()
config.read('location_config.ini')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
f = logging.Formatter('%(asctime)-15s - %(levelname)s - %(message)s')
fh = logging.FileHandler('../log/dist_block_cluster_upload'+datetime.now().strftime('%H_%M_%d_%m_%Y')+'.log')
fh.setFormatter(f)
logger.addHandler(fh)

#The loc_dict dictionary should have the district, block and Cluster files path against their keys
loc_dict = {'district': 'first', 'block': 'second', 'cluster': 'third'}

# The endpoint of the upload API
url = token_generate.host + config['API']['location_upload']
headers = {
    'Authorization': token_generate.auth_token,
    'x-authenticated-user-token': token_generate.user_token
}

for type, file in loc_dict.items():
    payload = {'type': type}
    filename = os.path.basename(file)
    files = [('file', (filename, open(file, 'rb'), 'text/csv'))]
    response = requests.request("POST", url, headers=headers, data=payload, files=files, timeout=30).json()
    logger.info([file, response])
    print(file, "-", response)
    if file != (list(loc_dict.values())[-1:][0]):
        time.sleep(30)
