# User Account System with Cloud Cookie Storage

## Requirements
- Node.js
- Express
- MongoDB
- AWS S3 (or any cloud storage service)

## Setup
1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following content:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
   S3_BUCKET_NAME=<your-s3-bucket-name>
   ```

4. **Run the server**
   ```sh
   npm start
   ```

## API Endpoints
- `POST /register`: Register a new user
- `POST /login`: Authenticate a user and set a cookie
- `GET /profile`: Get user profile information
- `POST /save-cookie`: Save a cookie to the cloud
- `GET /retrieve-cookie`: Retrieve a cookie from the cloud