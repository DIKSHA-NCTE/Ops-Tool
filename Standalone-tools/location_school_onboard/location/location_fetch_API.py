import os.path
import requests
import json
import token_generate as tg
import pandas as pd
# import pdb


state_name = input("Please provide the state name to fetch the State's location data:: ")

# A dictionary of all the State location name and it corresponding Id
State_dict = {"Jammu And Kashmir": "4a994d9d-5677-40a8-83eb-e3c5eec73b92",
              "Himachal Pradesh": "3332bb89-63e1-4e05-9927-25df984aec1f",
              "Punjab": "f82b3f03-76d2-40e4-927e-adda5aa053b1",
              "Chandigarh": "3095874c-5acf-4467-a5d0-9180ab9e318e",
              "Uttarakhand": "1aada48c-43dc-406a-bc07-ea50f804b657",
              "Haryana": "5188e272-b00a-4acf-845f-eb4f5898b030",
              "Delhi": "483c2468-3335-4ca0-9d86-c25fe90cfc63",
              "Rajasthan": "17821479-7ae7-476a-bd1c-a6a68b5e59ce",
              "Uttar Pradesh": "4ba4bdfb-d478-45f1-ba30-f8eb0aa03914",
              "Bihar": "645c54a4-6b75-4b77-8978-31aa489b638c",
              "Sikkim": "bbe77453-d901-4bd3-b1d8-e02f2213c567",
              "Arunachal Pradesh": "01481d5f-fb74-44ea-9b27-46835a1c97b4",
              "Nagaland": "413893e8-34e1-410a-8552-7c1ac6ffdeff",
              "Manipur": "4d8004d1-8f76-458f-bf39-56b81cd23953",
              "Mizoram": "ca924f6b-c473-4a25-a1ed-0c7a0df888f9",
              "Tripura": "b7416eb6-56b1-492a-a85f-97988edcd693",
              "Meghalaya": "8dc14006-36a5-4715-a5da-eaf4b8634093",
              "Assam": "5ca3abc3-7a0b-4d36-a090-37509903c96c",
              "West Bengal": "fcda9532-dc09-44bd-9d09-90812b37a3e4",
              "Jharkhand": "a10623c3-cc97-4971-a7fe-2f6d4e6883f7",
              "Odisha": "679d0a35-ef39-4a1f-a9ff-fe162d32267a",
              "Chhattisgarh": "463d1357-9793-48af-8fe6-bd76d53bdff1",
              "Madhya Pradesh": "0387f702-4003-4797-bac4-9647bd59152e",
              "Gujarat": "44f37ee7-9ffa-4aab-b434-394a1fc3e04b",
              "Dadra and Nagar Haveli and Daman and Diu": "d0caf333-85c1-4d3b-bff7-e0095f0ea948",
              "Maharashtra": "db331a8c-b9e2-45f8-b3c0-7ec1e826b6df",
              "Andhra Pradesh": "0393395d-ea39-49e0-8324-313b4df4a550",
              "Karnataka": "a38a280a-5a5c-4a86-82f4-68c669017cab",
              "Goa": "149502be-41d9-4ed7-913a-92b274efc0eb",
              "Lakshadweep": "042aed94-9eaf-4bc6-8455-17ef9be255ef",
              "Kerala": "83de176e-4cc2-4a97-946e-13142ded94cf",
              "Tamil Nadu": "a53f7e7e-5e04-4125-b7f6-a401ff38bd6f",
              "Puducherry": "a24f8e82-8df1-471a-89d2-ea2a08ce179f",
              "Andaman & Nicobar Islands": "9e43202f-a220-4eb4-9ca4-2fc37cfef32b",
              "Telangana": "cb66de7e-4f56-41e5-a7a1-4511e7c3a4a2",
              "Ladakh": "236aedca-d899-4ebe-a5ef-1078083f4b32", }


# Endpoint of the location search API
url = tg.host + "/api/data/v1/location/search?cache=false"
headers = {
    'Content-Type': 'application/json',
    'Authorization': tg.auth_token
}

# Function to fetch the location data based on the parentId
def locationread(parentId):
    payload = json.dumps({
        "request": {
            "filters": {
                "parentId": parentId
            },
            "sort_by": {"code": "asc"},
            "fields": ["code", "id", "name", "parentId", "type"],
            "limit": 10000
        }})
    response = requests.request("POST", url, headers=headers, data=payload, timeout=20).json()
    response = response['result']['response']
    return response

#Path to write the output data
root_path = "/home/tanweer/Downloads/Org&location/api_location_data"
output_path = os.path.join(root_path, state_name)
isExist = os.path.exists(output_path)
if not isExist:
    os.makedirs(output_path)
    
# locationread function gets called for District data 
locationread_dist = locationread(State_dict[state_name])
dist = pd.DataFrame(locationread_dist)
dist.to_csv(output_path + "/district.csv", index=False)
dist_ids = list(dist["id"])
# pdb.set_trace()

# locationread function gets called for Block data 
locationread_block = locationread(dist_ids)
block = pd.DataFrame(locationread_block)
block.to_csv(output_path + "/block.csv", index=False)
block_ids = list(block["id"])

# locationread function gets called for Cluster data 
locationread_cluster = locationread(block_ids)
cluster = pd.DataFrame(locationread_cluster)
cluster.to_csv(output_path + "/cluster.csv", index=False)
cluster_ids = list(cluster["id"])

# locationread function gets called for School data 
locationread_school = locationread(cluster_ids)
school = pd.DataFrame(locationread_school)
school.to_csv(output_path + "/school.csv", index=False)
