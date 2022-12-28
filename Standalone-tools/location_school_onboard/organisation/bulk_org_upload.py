import requests
import os
import token_generate
import time
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
f = logging.Formatter('%(asctime)-15s - %(levelname)s - %(message)s')
fh = logging.FileHandler('/home/tanweer/pycharm_diksha/log/bulk_org_upload'+datetime.now().strftime('%H_%M_%d_%m_%Y')+'.log')
fh.setFormatter(f)
logger.addHandler(fh)

# Endpoint for Organisation data upload API
url = token_generate.host + "/api/org/v1/upload"

# List of files consists of organisation data in a format to upload
file_path = [
             "/home/tanweer/Downloads/Chhattisgarh_v2/org/School_org_2.csv",
             "/home/tanweer/Downloads/Chhattisgarh_v2/org/School_org_3.csv",
             "/home/tanweer/Downloads/Chhattisgarh_v2/org/School_org_4.csv"
             ]

headers = {
    'Accept': 'application/json',
    'Authorization': token_generate.auth_token,
    'x-authenticated-user-token': token_generate.user_token
}
payload = {}
for count, file in enumerate(file_path):
    filename = os.path.basename(file)
    files = [('org', (filename, open(file, 'rb'), 'text/csv'))]
    response = requests.request("POST", url, headers=headers, data=payload, files=files, timeout=30).json()
    logger.info([file, response])
    print(count, response)
    if file != file_path[-1:][0]:
        time.sleep(60)


