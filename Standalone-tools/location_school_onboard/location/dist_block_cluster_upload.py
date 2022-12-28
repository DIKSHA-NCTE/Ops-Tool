import os
import requests
import token_generate
import time

#The loc_dict dictionary should have the district, block and Cluster files path against their keys
loc_dict = {'district': 'first', 'block': 'second', 'cluster': 'third'}

# The endpoint of the upload API
url = token_generate.host + "/api/data/v1/bulk/location/upload"
headers = {
    'Authorization': token_generate.auth_token,
    'x-authenticated-user-token': token_generate.user_token
}

for type, file in loc_dict.items():
    payload = {'type': type}
    filename = os.path.basename(file)
    files = [('file', (filename, open(file, 'rb'), 'text/csv'))]
    response = requests.request("POST", url, headers=headers, data=payload, files=files, timeout=30).json()
    print(file,  response)
    if file != (list(loc_dict.values())[-1:][0]):
        time.sleep(30)
