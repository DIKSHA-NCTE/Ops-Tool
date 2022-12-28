# This script would map the external ids provided in the input files with the Organisation Id fetched from the DIKSHA database
import time
import pandas as pd
import requests
import json
import token_generate


# List of organisation's data file's path
file_path = [
             "/home/tanweer/Downloads/Chhattisgarh_v2/org/School_org_10.csv"]
headers = {
    'Content-Type': 'application/json',
    'Authorization': token_generate.auth_token
}
# Endpoint for the Organisation search API
url = token_generate.host + "/api/org/v2/search?cache=false"

for count, file in enumerate(file_path):
    school_data = pd.read_csv(file, dtype={"locationCode": str, "externalId": str})
    school_data = school_data.drop(columns="organisationId")
    print("Creating the school org file with organisationId...")
    externalids = school_data.apply(lambda x: x['externalId'], axis=1)
    payload = json.dumps({
        "request": {
            "filters": {"externalId": list(externalids)},
            "fields": ["id", "externalId"],
            "limit": 9999
        }})

    response = requests.request("POST", url, headers=headers, data=payload, timeout=20).json()
    response = response['result']['response']['content']
    APIResponseDF = pd.DataFrame(response)
    APIResponseDF = APIResponseDF.rename(columns={'id': 'organisationId'})
    merge_df = school_data.merge(APIResponseDF, on="externalId", how='left')
    merge_df = merge_df[
        ["organisationId", "orgName", "locationCode", "status", "externalId", "description", "organisationType"]]
# This would replace the given input file with the file having the organisationId mapped
    merge_df.to_csv(file, index=False)
    if file != file_path[-1:][0]:
        time.sleep(15)

