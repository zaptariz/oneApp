# OneApp

 OneApp project can gather all my learning projects in one app. using the MongoDB database for storing all project details
 
## Prerequisite
- node
- npm
- mongo-client
>**_NOTE:_** To check the version of the Prerequisite by using ```--version``` flag.
Eg: ```node --version```

## Frameworks used 

- mongoose - interaction for MongoDB
- express - create a express router
- cors - Cross-Origin Resource Sharing it allows make requests from one website to another website in the browser
- http-status-codes - A server response code to a browser's or client request 
- jsonwebtoken - Used to share security information between two parties — a client and a server
- joi - To validating the body of the request 
- joi-objectid - Validating the MongoDB objectId
- is-github-url - Used to validate the given URL is a github URL or not
- multer - Used to upload the files 
- dotenv - It allows to make a separate secrets from your source code
- bcrypt - Used to Encryption and Decryption of the user password

## Run MongoDB
```sh
 mongod
```

## Installation
Install the dependencies and devDependencies and start the server.
```sh
git clone https://github.com/zaptariz/oneApp.git && \
cd oneApp && \
npm i && \
nodemon
```