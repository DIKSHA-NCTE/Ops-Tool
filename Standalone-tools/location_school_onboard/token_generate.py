import requests
import sys
import pyperclip
from tokens import hosts, client_id_value, secret_keys, authorization_token, user_name, keycloak_api

i = 1
while i > 0:
    try:
        env_selector = int(input("Enter the environment, 0/1/2/3 for Dev Diksha, Staging, preprod and prod respectively: "))
        if 0 <= env_selector < len(hosts):
            i -=1
        else:
            print("The given value is out of range of the environment list!")
    except:
        print("Invalid value provided!")

host = hosts[env_selector]
client_id = client_id_value[env_selector]
secret_key = secret_keys[env_selector]
url = host + keycloak_api
auth_token = "bearer " + authorization_token[env_selector]

username_ask = input("You want to use default USERNAME? press y/Y to accept: ")
if username_ask.lower() == 'y':
        username = user_name
else:
    username = input("Please provide the USERNAME: ")
payload = "client_id=" + client_id + "&username=" + username + "&password=&grant_type=password&client_secret=" + secret_key
headers = {
    'Content-Type': "application/x-www-form-urlencoded"
}
try:
    token_response = requests.request("POST", url, data=payload, headers=headers)
    token_response1 = token_response.json()
    user_token = token_response1["access_token"]
    refresh_token = token_response1["refresh_token"]
except:
    print("Status code - {0} received".format(token_response.status_code))
    sys.exit()
print("User_token:", user_token)
print("refresh_token:", refresh_token)
pyperclip.copy(user_token)
