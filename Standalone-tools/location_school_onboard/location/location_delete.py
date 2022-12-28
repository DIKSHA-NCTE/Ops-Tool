import requests
import token_generate
headers = {
        'Content-Type': 'application/json',
        'Authorization': token_generate.auth_token,
        'x-authenticated-user-token': token_generate.user_token
    }

# List of Location ids which needs to be retired 
location_ids = ["8a9bafaf-e9c9-4cfe-bc7f-48883669b00d",
"2f413329-d849-4a83-b030-6a6a006956b3",
"a926c1fc-5147-4fd7-88c7-ed837a0458c9",
"74376b27-6e68-4ecb-aa6e-31d042bc071a"]

payload = "{}"
for count, locationid in enumerate(location_ids):

    url = token_generate.host + "/api/data/v1/location/delete/" + locationid	#The endpoint of the location delete API followed by the location id 
    response = requests.request("DELETE", url, headers=headers, data=payload, timeout=20).json()
    print(count, response)
