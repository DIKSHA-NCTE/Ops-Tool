#!/bin/bash
home=$(pwd)
echo "Please enter the environment (development/production)"
read ENV

# Reading variables provided by the user
if [[ $ENV == 'development' ]] || [[ $ENV == 'production' ]]; then
    echo "Starting environment configuration...\n\n"
    echo "Enter host for the instance. eg: https://diksha.gov.in"
    read BASE
    echo "Enter API key for Ops Tool"
    read API_KEY
    echo "Enter KeyCloak Client ID for Ops Tool"
    read RESOURCE
    echo "Enter KeyCloak Client Secret for Ops Tool"
    read SECRET
    echo "Enter Course Exhaust Report api end point. eg: https://diksha.gov.in/api/exhaust-report"
    read DATAEXHAUSTKONGAPIURL
    echo "Enter Blob storage account client"
    read BLOB_ACCOUNT
    echo "Enter SAS token for Exhaust Reports folder"
    read EXHAUSTREPORTSAS
    echo "Enter SAS token for Broadcast Contents folder"
    read BROADCASTCONTENTSAS
    echo "Enter Custodian Organisation name for the instance"
    read CUSTODIAN_ORG
    echo "Enter Database User"
    read DB_USER
    echo "Enter Database Password"
    read DB_PASSWORD

    if [[ $ENV == 'production' ]]; then
    echo "Enter host for Ops Tool Instance. eg: https://ops.diksha.gov.in"
    read OPS_HOST
    fi

# Configuring .env file
    if [[ -z $BASE ]]; then
        empty='true'
        echo BASE="<Host for adopters instance>" > .env
        echo KEYCLOCKBASE="<base url of keycloak server>" >> .env
    else
        echo BASE=$BASE'/' > .env
        echo KEYCLOCKBASE=$BASE'/' >> .env
    fi
    if [[ -z $API_KEY ]]; then
        empty='true'
        echo API_KEY="Bearer <api key>" >> .env
    else
        echo API_KEY=Bearer $API_KEY >> .env
    fi
    if [[ -z $RESOURCE ]]; then
        empty='true'
        echo RESOURCE="<Ops Tool Keycloak Client ID>" >> .env
    else
        echo RESOURCE=$RESOURCE >> .env
    fi
    if [[ -z $SECRET ]]; then
        empty='true'
        echo SECRET="<Ops Tool Keycloak Client Secret>" >> .env
    else
        echo SECRET=$SECRET >> .env
    fi
    if [[ -z $DATAEXHAUSTKONGAPIURL ]]; then
        empty='true'
        echo DATAEXHAUSTKONGAPIURL="<Exhaust Report api url>" >> .env
    else
        echo DATAEXHAUSTKONGAPIURL=$DATAEXHAUSTKONGAPIURL >> .env
    fi
    if [[ -z $BLOB_ACCOUNT ]]; then
        empty='true'
        echo BLOB_ACCOUNT="<Blob Account Client>" >> .env
    else
        echo BLOB_ACCOUNT=$BLOB_ACCOUNT >> .env
    fi
    if [[ -z $EXHAUSTREPORTSAS ]]; then
        empty='true'
        echo EXHAUSTREPORTSAS="<SAS token for Exhaust Reports blob folder>" >> .env
    else
        echo EXHAUSTREPORTSAS=$EXHAUSTREPORTSAS >> .env
    fi
    if [[ -z $BROADCASTCONTENTSAS ]]; then
        empty='true'
        echo BROADCASTCONTENTSAS="<SAS token for Broadcast Contents blob folder>" >> .env
    else
        echo BROADCASTCONTENTSAS=$BROADCASTCONTENTSAS >> .env
    fi

# Configuring client and server environment files
    if [[ $ENV == 'development' ]]; then

    echo 'export const environment = {
    production: false,
    PLAY_URL: "'${BASE}/play/content/'",
    base : "'${BASE}/api/'",
    key_base : "'${BASE}/'",
    LOCALHOST :"http://localhost:3000/api/",
    RESOURCE: "'${RESOURCE}'",
    CUSTODIAN_ORG: "'${CUSTODIAN_ORG}'"
    };' > Ops-Tool-Client/src/environments/environment.ts

    echo '{
    "database": {
        "connectionLimit": 10,
        "host": "localhost",
        "user": "'${DB_USER}'",
        "password": "'${DB_PASSWORD}'",
        "database": "ETBPROCESS"
    },
    "server": {
        "port": 3000
    },
    "keycloak": {
        "auth_server_url": "'${BASE}/auth'",
        "resource": "'${RESOURCE}'"
    }
    }' > Ops-Tool-Server/config/config.development.json
    fi

    if [[ $ENV == 'production' ]]; then

    echo 'export const environment = {
    production: true,
    PLAY_URL: "'${BASE}/play/content/'",
    base : "'${BASE}/api/'",
    key_base : "'${BASE}/'",
    LOCALHOST :"'${OPS_HOST}/api/'",
    RESOURCE: "'${RESOURCE}'",
    CUSTODIAN_ORG: "'${CUSTODIAN_ORG}'"
    };' > Ops-Tool-Client/src/environments/environment.prod.ts

    echo '{
    "database": {
        "connectionLimit": 10,
        "host": "localhost",
        "user": "'${DB_USER}'",
        "password": "'${DB_PASSWORD}'",
        "database": "ETBPROCESS"
    },
    "server": {
        "port": 3000
    },
    "keycloak": {
        "auth_server_url": "'${BASE}/auth'",
        "resource": "'${RESOURCE}'"
    }
    }' > Ops-Tool-Server/config/config.production.json
    fi

# Installing Dependencies
    echo "Installing dependencies...\n\n"
    cd $home/Ops-Tool-Client
    npm install

    cd $home/Ops-Tool-Server
    npm install

# Creating Static Folders
    echo "Creating static folders...\n\n"
    cd $home/Ops-Tool-Server
    mkdir -p uploads logs
    cd uploads
    mkdir -p course-reports csvOutput input self-signup-user-reports streamedOutput
    cd $home

# Setting up Database with all the required tables and data
    echo "Setting up database...\n\n"
    mysqladmin create ETBPROCESS -u root -p$DB_PASSWORD;
    mysql ETBPROCESS < $home/Ops-Tool-Server/db-scripts/ETBPROCESS.sql -u root -p$DB_PASSWORD;
    mysql ETBPROCESS < $home/Ops-Tool-Server/db-scripts/constants.sql -u root -p$DB_PASSWORD;
    mysql ETBPROCESS < $home/Ops-Tool-Server/db-scripts/modules.sql -u root -p$DB_PASSWORD;

# Configuring forms
    if [[ -z $BASE ]] && [[ -z $API_KEY ]]; then
        for file in $home/Ops-Tool-Server/config/forms/*
        do
            curl --location --request POST "'${BASE}'" \
            --header 'Content-Type: application/json' \
            --header 'Authorization: Bearer '${API_KEY}'' \
            --data-raw "'$(<$file)'"
        done
    fi

echo "Ops Tool setup completed successfully!"
else
    echo "Couldn't complete the setup as no/wrong environment was selected. Please, try again.\n\n"
    sh ./setup.sh
fi