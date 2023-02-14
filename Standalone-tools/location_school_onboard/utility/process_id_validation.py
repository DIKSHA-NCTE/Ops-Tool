# This script would validate the process ids generated against uploads
import requests
import json
import os
import token_generate as tg
from configparser import ConfigParser

config = ConfigParser()
config.read('config.ini')

#Process ids can be passed here
p_ids = ["01369023921383014444498",
"01369023697895424044501"]

out_path = "/home/tanweer/Downloads/"

payload = {}
headers = {
    'Content-Type': 'application/json',
    'Authorization': tg.auth_token,
    'x-authenticated-user-token': tg.user_token
}
endpoint = tg.host + config['API']['upload_status']
for pid in p_ids:
    url = endpoint + str(pid)
    try:
        response = requests.request("GET", url, headers=headers, data=payload).json()
        response1 = response["result"]["response"][0]['successResult']
        response2 = response["result"]["response"][0]['failureResult']
        print(response["responseCode"])
    except KeyError:
        print("failureResult/successResult not found, please check if process has started")
    with open(os.path.join(out_path, "school_preprod_success_orgg.json"), 'a') as file1:
        json.dump(response1, file1)
    with open(os.path.join(out_path, "school_preprod_failure_orgg.json"), 'a') as file2:
        json.dump(response2, file2)
