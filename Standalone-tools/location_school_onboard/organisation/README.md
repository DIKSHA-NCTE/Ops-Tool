# Introduction
The set of Scripts would give the capability to perform CRUD operation on location data using the sunbird APIs.

# Prerequisite
- Python version 3.6 and above

# briefing of Scripts

## bulk_org_upload
bulk_org_upload script uses the */api/org/v1/upload* endpoint to upload the sub-organisation or school data to the database in bulk.

#### Variable values needs to be updated in the script
- file_path - The file_path variable accepts the the list of file path which must contains the formatted organisation data that needs to be uploaded. The maximium number of rows in each file should not contain more than 5k records.

#### NOTE:
The sub-organisation or school data would get mapped to the organisation(rootOrg) based on the user token, which means the schools will map to the user's organisation for which the user token gets generated.

## orgId_mapping
orgId_mappin script uses the */api/org/v2/search* endpoint to map the organisationId with the externalId by fetching the value from the database. The mapping is required in order to ensure that if the externalId exists in the system, the API would perform the update operation for the entry.

#### Variable values needs to be updated in the script
- file_path - The file_path variable accepts the the list of file path which must contains the formatted organisation data that needs to be mapped. The maximium number of rows in each file should not contain more than 5k records.

## org_status_update
org_status_update script uses the endpoint */api/org/v1/status/update* to update status of the organisation. This means that would soft delete an organisation or can bring back the soft deleted organisation to live status.

#### Variable values needs to be updated in the script
- school_ids - The school_ids variable accepts the list of school ids to whose status needs to be changed.

## NOTE:
Please note that all of these scripts will internally call the token_generate Script which generate the authentication token against the username or email address provided. In order to generate the token, the values of **hosts, client_id_value, secret_keys, authorization_token, user_name** has to be updated in **tokens.py** file.