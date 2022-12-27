# Ops-Tool
---
## What is Ops Tool?
Ops Tool is browser based application developed by DIKSHA to carry out various operations related tasks like accessing the details of Users, Contents etc and perform the support activities such as uploading the users, contents, downloading the reports, certificates etc., without explicitly providing the API access to each individual person in the operations team.

## Getting Started
### Installing Ops Tool
Installing Ops Tool requires three primary software components:

- Ops Tool web application or Angular Client
- Ops Tool Backend API interface or Node Server
- Database

## Table of contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Running Application](#running-application)
---

### Prerequisites

<table>
  <tr>
    <td colspan="2"><b>System Requirements</b></td>
  </tr>
  <tr>
    <td><b>Operating System</b></td>
    <td>Windows 7 and above/4.2 Mac OS X 10.0 and above/Linux</td>
  </tr>
  <tr>
    <td><b>RAM</b></td>
    <td>> 1.5 Gb</td>
  </tr>
  <tr>
    <td><b>CPU</b></td>
    <td>2 cores, > 2 GHz</td>
  </tr>
</table>

| Software dependencies |  |
| :--- | ------- |
| **[Node](https://nodejs.org/en/download/)** | > 16.x.x |
| **[Angular CLI](https://angular.io/cli#installing-angular-cli)** | > 11.x.x |
| **[MySQL Server](https://dev.mysql.com/downloads/mysql/)** | 8.0 |
| **[nodemon](https://www.npmjs.com/package/nodemon)** | Latest version  of nodemon: `npm install -g nodemon` |
| **[Python](https://www.python.org/downloads/)** | Python 3 |
| **[ffmpeg](https://www.ffmpeg.org/download.html)** | --- |
| **[azcopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10#download-azcopy)** | --- |

### Project Setup

1. Clone project

    ```console
    git clone https://github.com/DIKSHA-NCTE/Diksha-Support-Tool.git
    ```

2. Install required dependencies

    1. Ops Tool web application

        1. $ cd {PROJECT-FOLDER}/Ops-Tool-Client
        2. $ npm install

    2. Ops tool backend API interface

        1. $ cd {PROJECT-FOLDER}/Ops-Tool-Server
        2. $ npm install
3. Configuring .env file

     1. $ cd {PROJECT-FOLDER}/Ops-Tool-Server
     2. Create a file with filename `.env`
     3. Copy paste the below contents in .env file and replace the values accordingly based on the environment (dev/production)

        ```console
        BASE=<host for adopter's instance>
        KEYCLOCKBASE=<base url of keycloak server>
        API_KEY=Bearer <api key>
        SECRET=<ops tool keycloak client secret>
        RESOURCE=<ops tool keycloak client id>
        DATAEXHAUSTKONGAPIURL=<exhaust report kong api url>
        BLOB_ACCOUNT=<blob account client>
        EXHAUSTREPORTSAS=<SAS token for exhaust report blob folder>
        BROADCASTCONTENTSAS=<SAS token for broadcast contents blob folder>
        ```

4. Edit the application configuration
    > Open `<PROJECT-FOLDER>/Ops-Tool-Client/src/environments/environtment.ts` in any available text editor and update the contents of the file so that it                   contains exactly the following values :

      ```console
      export const environment = {
          production: false,
          PLAY_URL: '<host for adopter's instance>/play/content/',
          base : '<host for adopter's instance>/api/',
          key_base : '<host for adopter's instance>',
          LOCALHOST : '<host for adopter's ops tool instance>/api/',
          RESOURCE: '<ops tool keycloak client id>',
        };
      ```
      
      > ***Note***: For production environment the above values need to be updated in `<PROJECT-FOLDER>/Ops-Tool-Client/src/environments/environtment.prod.ts` with                         `production: true` value.
      ---

     > Open `<PROJECT-FOLDER>/Ops-Tool-Server/config/config.development.js` in any available text editor and update the contents of the file so that it                        contains exactly the following values :

      ```console
      {
        "database": {
          "connectionLimit": 10,
          "host": "localhost",
          "user": "root",
          "password": "<DB-password>",
          "database": "ETBPROCESS"
        },
        "server": {
          "port": 3000
        },
        "keycloak": {
          "auth_server_url": "<host for adopter's instance>/auth",
          "resource": "<ops tool keycloak client id>"
        }
      }
      ```
      > ***Note***: For production environment the above values need to be updated in `<PROJECT-FOLDER>/Ops-Tool-Server/config/config.production.js`.

5. Database Setup

      From terminal run below commands in the following order:
  
        1. $ mysql -u root -p
        2. $ source {PROJECT-FOLDER PATH}/Ops-Tool/Ops-Tool-Server/db-scripts/ETBPROCESS.sql
        3. $ ETBPROCESS < {PROJECT-FOLDER PATH}/Ops-Tool/Ops-Tool-Server/db-scripts/constants.sql
        4. $ ETBPROCESS < {PROJECT-FOLDER PATH}/Ops-Tool/Ops-Tool-Server/db-scripts/modules.sql

6. Creating static server directories

   1. $ cd {PROJECT-FOLDER}/Ops-Tool-Server
   2. $ mkdir uploads
   3. $ cd uploads
   4. $ mkdir course-reports csvOutput input self-signup-user-reports streamedOutput

7. Form Configuration

    All the available forms for the Ops Tool can be found in `<PROJECT-FOLDER>/Ops-Tool-Server/config/forms` folder.

    Following is the sample curl for creating the forms for Ops Tool :
    
      ```console
      curl --location --request POST '{{host}}/api/data/v1/form/create' \
      --header 'Content-Type: application/json' \
      --header 'Authorization: Bearer {{api_key}}' \
      --data-raw '{
          "request": {
          "type": "filter",
          "subType": "contents",
          "action": "search",
          "component": "tools",
          "framework": "*",
          "rootOrgId": "*",
          "data": {
            "templateName": "defaultTemplate",
            "action": "search",
            "fields": [
              {
                "index": 0,
                "label": "Tenants",
                "description": "Choose from a list of tenants",
                "placeholder": "Choose a Tenant",
                "property": "rootOrgId",
                "dataType": "array",
                "inputType": "search",
                "options": [],
                "visible": true,
                "editable": true,
                "required": false,
                "multiple": false,
                "api": {
                  "type": "tenant-search",
                  "body": "{ \"request\": { \"filters\": { \"isRootOrg\": true, \"isTenant\": true }, \"offset\": 0, \"limit\": 1000, \"sort_by\": {}, \"fields\": [\"identifier\", \"orgName\", \"channel\", \"isTenant\", \"isRootOrg\"] } }",
                  "token": true
                }
              }
            ]
          }
        }
      }'
      ```
      > ***Note***: All the forms in the `<PROJECT-FOLDER>/Ops-Tool-Server/config/forms` folder need to be created by replacing the request body in above curl for each form.

8. Google Authentication Setup

Follow the steps provided [here](https://developers.google.com/drive/api/quickstart/nodejs) to generate `credentials.json` and `token.json` files and copy these two files to `PROJECT-FOLDER>/Ops-Tool-Server` folder.

### Running Application

1. Ops Tool web application

    1. Run the following command in the **{PROJECT-FOLDER}/Ops-Tool-Client** folder
    2. $ npm run build-dev (for development build) or $ npm run build-prod (for production build)
    3. Wait for the build process to complete before proceeding to the next step

2. Sunbird services stack or the backend API interface

    1. Run the following command in the **{PROJECT-FOLDER}/Ops-Tool-Server** folder
    2. $ npm run start-dev (for development environment)

3. The local HTTP server is launched at `http://localhost:3000`