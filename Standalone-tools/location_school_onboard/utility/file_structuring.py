# This script would structure the input sheet received from the State side in order to upload the data to DIKSHA
import pandas as pd
import os
from utilities.split_csv_file import split
from configparser import ConfigParser

config = ConfigParser()
config.read('config.ini')
filename = config['File']['filename']
if os.path.isfile(filename) is False:
  raise Exception("File not found")
output_path = os.path.dirname(filename)
print("Path to write output files", output_path)
extension = os.path.splitext(filename)[1]

dtypes={"SCHOOL_CODE": str, "BLOCK_CODE": str, "cluster_name": str, "school_name": str,"DISTRICT_CODE": str,
        "District_Name": str, "udise_block_code": str,"block_name": str, "CLUSTER_CODE": str}
school_master = pd.DataFrame
if extension == '.xlsx':
    school_master = pd.read_excel(filename, dtype= dtypes)
elif extension == '.csv':
    school_master = pd.read_csv(filename, dtype=dtypes)
else:
    raise Exception("File format not supported, Please provide the input file in csv or xlsx format")

df_obj = school_master.select_dtypes(['object'])
school_master[df_obj.columns] = df_obj.apply(lambda x: x.str.strip())

### District file generate ###
district_data = school_master.filter(["DISTRICT_CODE", "DISTRICT_NAME"])
district_data = district_data.drop_duplicates(subset='DISTRICT_CODE')
district_data['DISTRICT_NAME'] = district_data['DISTRICT_NAME'].str.title()
state_code = district_data['DISTRICT_CODE'][0][:2]
district_data['parentCode'] = state_code
district_data['parentId'] = ''
district_data = district_data.rename(columns={'DISTRICT_CODE': 'code', 'DISTRICT_NAME': 'name'})
district_data = district_data.filter(['code', 'name', 'parentCode', 'parentId'])
district_data = district_data.sort_values(by=['code'])
district_data.to_csv(output_path + '/District.csv', index=False)
print("District File Generated...")
### End of District file generate ###

### Block file generate ###
block_data = school_master.filter(["BLOCK_CODE", "BLOCK_NAME", "DISTRICT_CODE"])
block_data = block_data.drop_duplicates(subset='BLOCK_CODE')
block_data['BLOCK_NAME'] = block_data['BLOCK_NAME'].str.title()
block_data['parentCode'] = block_data['DISTRICT_CODE']
block_data['parentId'] = ''
block_data = block_data.rename(columns={'BLOCK_CODE': 'code', 'BLOCK_NAME': 'name'})
block_data = block_data.filter(['code', 'name', 'parentCode', 'parentId'])
block_data = block_data.sort_values(by=['code'])
block_data.to_csv(output_path + '/Block.csv', index=False)
print("Block File Generated...")
### End of Block file generate ###

### Cluster file generate ###
cluster_data = school_master.filter(["BLOCK_CODE", "CLUSTER_CODE", "CLUSTER_NAME"])
cluster_data = cluster_data.drop_duplicates(subset='CLUSTER_CODE')
cluster_data['CLUSTER_NAME'] = cluster_data['CLUSTER_NAME'].str.title()
cluster_data['parentCode'] = cluster_data['BLOCK_CODE']
cluster_data['parentId'] = ''
cluster_data = cluster_data.rename(columns={'CLUSTER_CODE': 'code', 'CLUSTER_NAME': 'name'})
cluster_data = cluster_data.filter(['code', 'name', 'parentCode', 'parentId'])
cluster_data = cluster_data.sort_values(by=['code'])
cluster = output_path + "/cluster"
isExist = os.path.exists(cluster)
if not isExist:
    os.makedirs(cluster)
cluster_path = cluster + '/Cluster.csv'
cluster_data.to_csv(cluster_path, index=False)
if len(cluster_data) > 5001:
    split(cluster_path)
print("Cluster File Generated...")
### End of Cluster file generate ###

### School location file generate ###
school_data = school_master.filter(["CLUSTER_CODE", "SCHOOL_CODE", "SCHOOL_NAME"])
school_data = school_data.drop_duplicates(subset='SCHOOL_CODE')
school_data['SCHOOL_NAME'] = school_data['SCHOOL_NAME'].str.title()
school_data['parentCode'] = school_data['CLUSTER_CODE']
school_data['parentId'] = ''
school_data = school_data.rename(columns={'SCHOOL_CODE': 'code', 'SCHOOL_NAME': 'name'})
school_data = school_data.filter(['code', 'name', 'parentCode', 'parentId'])
school_data = school_data.sort_values(by=['code'])
loc = output_path + "/school_location"
isExist = os.path.exists(loc)
if not isExist:
    os.makedirs(loc)
school_loc_path = loc + '/School_location.csv'
school_data.to_csv(school_loc_path, index=False)
if len(school_data) > 5001:
    split(school_loc_path)
print("School Location File Generated...")

### School Org file generate ###
school_data = school_data.rename(columns={'code': 'externalId', 'name': 'orgName', 'parentCode': 'locationCode'})
school_data['description'] = ''
school_data['status'] = 'Active'
school_data['organisationType'] = 'school'
school_data['organisationId'] = ''
school_data = school_data[["organisationId", "orgName", "locationCode", "status", "externalId", "description", "organisationType"]]

org = output_path + "/org"
isExist = os.path.exists(org)
if not isExist:
    os.makedirs(org)
school_org_path = org + "/School_org.csv"
school_data.to_csv(school_org_path, index=False)
if len(school_data) > 5001:
    split(school_org_path)
print("sub-org school upload format generated!")
