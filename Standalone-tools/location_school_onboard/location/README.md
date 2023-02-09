# Introduction
The set of Scripts would give the capability to perform CRUD operation on location data using the sunbird APIs.

# Prerequisite
- Python version 3.6 and above


# briefing of Scripts

## bulk_location_upload
bulk_location_upload script uses the */api/data/v1/bulk/location/upload* endpoint to upload the location data to the DIKSHA database in bulk.
 

#### Variable values needs to be updated in the script
- file_path - The file_path variable accepts the the list of file path which must contains the formatted location data that needs to be uploaded. The maximium number of rows in each file should not containg more than 5k records.

- payload - The payload variable contains the type of location which would get uploaded. e.g state/district/block/cluster/school. Please note that all the records in file must belongs to the same type of location.


## dist_block_cluster_upload
dist_block_cluster_upload script uses the */api/data/v1/bulk/location/upload* endpoint to upload the location data to the DIKSHA database. This script is different from bulk_location_upload as this script would upload the location data of 3 different type(district, block, cluster) of location in one call. This script can be called in case where the location data of each type is less than or equal to 5k records.

#### Variable values needs to be updated in the script
loc_dict - This variable has to updated in the script with values of district, block, and cluster by passing their respective file paths.


## location_delete
location_delete script is used to delete any particular location data from the DIKSHA database. This API calls the */api/data/v1/location/delete/* endpoint to delete loctation entry.

### Variable values needs to be updated in the script
location_ids - location_ids variable would accept the list of location Ids which would need to be deleted. Please note that if a location id is mapped with any child location, the location id wouldn't be deleted.


## location_fetch_API
location_fetch_API script fetch the location data from the DIKSHA system and store it to the location as CSV files. This script uses */api/data/v1/location/search* endpoint to fetch the location data from the system. This script would extract the location type of district, block, cluster, and school upto 10k records for each type as the max limit of API response is 10k. The location data is being fetched for the State selected on the prompt for the user.

### Variable values needs to be updated in the script
- State_dict - State_dict variable value needs to be updated. This would accept the state name, and state Id as key value pair. Please note that the state Id varies to the environment selected.

## NOTE:
Please note that all of these scripts will internally call the token_generate Script which generate the authentication token against the DIKSHA username or email address. In order to generate the token, the values of **hosts, client_id_value, secret_keys, authorization_token, user_name** has to be updated in **tokens.py** file.