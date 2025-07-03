Personal Finance Tracker

This is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The app allows users to manage personal finances by tracking expenses, managing budgets, and viewing spending alerts.

What the App Does:

- Allows user registration and login using secure JWT authentication
- Users can add, view, update, and delete expenses
- Set monthly budgets per category
- Filter expenses by category, method (Cash, UPI, Credit Card), and date
- Receive alerts when spending in a category exceeds 80% of the budget
- Simple dashboard showing total spending, top category, and more
- Search expenses by notes or category

Live Deployed Site:

You can access the live version of the app here:
https://your-live-site-link.com

Test Login Credentials:

Email: test@gmail.com
Password: Test@12

You can also register with your own credentials.

How to Run Locally:

1. Clone the repository and open the project folder.

2. Set up Backend:

   - Navigate to the 'server' folder:
     cd server

   - Install dependencies:
     npm install

   - Create a .env file using the .env.example format

   - Run the server:
     npm run dev

3. Set up Frontend:

   - Navigate to the 'client' folder:
     cd client

   - Install dependencies:
     npm install

   - Create a .env file using the .env.example format

   - Run the React frontend:
     npm run dev

.env.example Files:

Backend (.env.example):
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Frontend (.env.example):
VITE_BACKEND_URL=http://localhost:5000

Project Structure:

client/

- React frontend with all pages and components
  server/
- Express backend with routes, models, and controllers
  .env.example files in both folders to help set up environment variables

Extra Features:

- Budget Alert Bell with red warning when budget crosses 80%
- Filters for category, method, and date
- Search functionality for expenses
- Clean UI with light background
- Responsive layout for desktop and mobile

Author:

Shubham Bharti

GitHub: https://github.com/shubhambharti

Live on: https://shubham-finance-tracker.netlify.app/
