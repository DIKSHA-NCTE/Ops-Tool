# This script would update the status of the organisation ids passed. Updating the status of an organisation to 0 indiactes soft deleting an organisation.
import requests
import json
import token_generate
from configparser import ConfigParser

config = ConfigParser()
config.read('org_config.ini')

# List of organisation ids needs to be passed here. The existing ids are the sample id given here, these ids needs to be replaced with the actual ids.
school_ids = [
"01324218757264179240729",
"01324218879352012852401",
"01324218885878579249711",
"01324219148197068842994",
"01324218482085068834217"]

# Endpoint of the org status update API
url = token_generate.host + config['API']['org_status_update']
headers = {
  'Content-Type': 'application/json',
  'Authorization': token_generate.auth_token,
  'x-authenticated-user-token': token_generate.user_token
}
for count, school_id in enumerate(school_ids):
    payload = json.dumps({
      "request": {
        "organisationId": str(school_id),
        "status": 0
      }
    })
    response = requests.request("PATCH", url, headers=headers, data=payload).json()
    print(count, response)
