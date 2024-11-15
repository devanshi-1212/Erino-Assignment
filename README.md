# Erino SDE Internship Assignment
## Contact Management - Mini Feature of a CRM

## Walkthrough:
https://github.com/user-attachments/assets/592342fe-dfe6-4250-a89c-880934b71ae1

## Features:
- Created a Contact Management feature to help users of the system to keep a track of important contact information of customers / clients.
- Facilitates operations like adding, viewing, updating, and deleting contact details all in one place.
- Implemented featured like pagination & sorting to the table for better usability.
- Used Material UI for simple UI for user readability.
- Implemented error handling for invalid or duplicate data.

## Reason for choosing MongoDB as Database:
- MongoDB is used as database as it facilitates quicker write operations. It also gives flexibility while inserting data, unlike MySQL where schema is rigid.
- For example, some contacts may not have Company name or Job Title. If using MySQL, these entries would be stored as NULL. This could result in having too many NULL values. Using MongoDB gives this flexibility to insert data, while taking less storage and not having a rigid architecture.


## Technologies Used:
- Frontend: ReactJS, CSS
- Backend: NodeJS, ExpressJS
- Database: MongoDB
- Deployment: Render

## Installation:
- Clone repository:
  git clone https://github.com/devanshi-1212/Erino-Assignment.git
- Install dependencies:
  npm install
- Setup MongoDB Atlas database and modify database configuration in .env
- Run the application now:
  npm start
- Open browser and visit:
  https://localhost:3000
