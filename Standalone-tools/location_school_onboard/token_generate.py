import requests
import sys
import pyperclip
from tokens import token, secret_keys, client_id_value, dev_user_name, user_name

# List of Hosts under which the API's would be called
hosts = ["https://dev.diksha.gov.in", "https://staging.sunbirded.org/", "https://preprod.ntp.net.in",
         "https://diksha.gov.in"]
env_selector = int(input("Enter the environment, 0/1/2/3 for Dev Diksha, Staging, preprod and prod respectively: "))
if env_selector > 3:
    print("INVALID INPUT")
    sys.exit()
host = hosts[env_selector]
client_id = client_id_value[env_selector]
secret_key = secret_keys[env_selector]
url = host + "/auth/realms/sunbird/protocol/openid-connect/token"
auth_token = "bearer " + token[env_selector]

username_ask = input("You want to use default USERNAME? press y/Y to accept: ")
if username_ask.lower() == 'y':
    username = user_name
else:
    username = input("Please provide the USERNAME: ")
payload = "client_id=" + client_id + "&username=" + username + "&password=&grant_type=password&client_secret=" + secret_key
headers = {
    'Content-Type': "application/x-www-form-urlencoded",
    'User-Agent': "PostmanRuntime/7.20.1",
    'Accept': "*/*",
    'Cache-Control': "no-cache",
    'Postman-Token': "1a8efc56-fcf5-448b-9852-7fc26bdabbed,d0a99fb8-9f13-4d9e-8f00-57723bca95d1",
    'Connection': "keep-alive",
    'cache-control': "no-cache"
}
try:
    token_response = requests.request("POST", url, data=payload, headers=headers)
    token_response1 = token_response.json()
    user_token = token_response1["access_token"]
    refresh_token = token_response1["refresh_token"]
except:
    print("Exception occurred, Status code - {0} received".format(token_response.status_code))
    sys.exit()
print("User_token:", user_token)
print("refresh_token:", refresh_token)
# The user_token would be copied to clipboard in order to paste anywhere needed
pyperclip.copy(user_token)
