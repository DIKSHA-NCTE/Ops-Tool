# Introduction
The set of scripts will provide the utility functions in performing CRUD operation on location and organisation data.

# Prerequisite
- Python version 3.6 and above

# briefing of Scripts

## file_structuring
file_structuring script would create the directory structure and does the file formation to which the APIs accept for the location and school data onboard. This script would internally call the **split_csv_file** script which would split each category of location and school into 5k records if the records are greater than 5k. Along with that if any record or entry contains any leading or trailing space, the script remove this as well. Let's understand with a scenario, The State team would always share one single consolidated file which contains all the location and school data info. The file can large enough based on number of Schools the State persist, in the scenario this script would help in formation of the file formation and split the consoldated file in chunk.

The files would get generated on the same input directory with complete directory structure.

#### Variable values needs to be updated in the config file
- filename - The filename variable accepts the file path. The file path would need to be passed as string.

## process_id_validation
process_id_validation script uses the endpoint */api/data/v1/upload/status/* to validate the process status against process id and stores the response in the json files locally.

#### Variable values needs to be updated in the config file
- p_ids - The p_ids accepts the list of process Ids.
- out_path - The out_path accepts the path value where the files would be written.




