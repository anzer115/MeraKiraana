# MeraKiraana

MeraKiraana is an online store for groceries and daily essentials. Built to bridge the gap between local grocery vendors and customers, it provides a seamless platform for users to shop for groceries, manage their cart, and complete payments online.

## Features

- **User Authentication**: Google OAuth (via Passport.js) for users.
- **Admin Security**: JWT & bcrypt for secure admin authentication.
- **Product Management**: Admins can add, update, and delete products and categories.
- **Cart Functionality**: Users can add or remove items from their cart.
- **Payments**: Integrated Razorpay for secure and fast online transactions.
- **Mapping and Routes**: Leaflet.js for real-time mapping and route generation.
- **Responsive Design**: Frontend designed using EJS and styled with TailwindCSS for a seamless experience across all devices.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Google OAuth (Passport.js), JWT, bcrypt
- **Payments**: Razorpay integration
- **Mapping**: Leaflet.js
- **Frontend**: EJS, TailwindCSS
- **Version Control**: Git, GitHub

## Installation

To set up MeraKiraana on your local machine:

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/)
- Razorpay account for payment integration.

### Clone the Repository

```bash
git clone https://github.com/yourusername/MeraKiraana.git 
```

### Navigate to the Project Directory

```bash
cd MeraKiraana
```
### Install Dependencies

```bash
npm install
```


### Environment Variables Setup
```bash
MONGO_URL=your_mongodb_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
EXPRESS_SECRET=your_express_secret_key
NODE_ENV=DEVELOPMENT
JWT_KEY=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
### Run the Application
```bash
node app.js 
```
###  Setting up Google OAuth for MeraKiraana, follow these steps:

### 1. Create a Project in Google Developer Console

- Go to [Google Developer Console](https://console.developers.google.com/).
- Click on **Select a Project** in the top-right corner and then click **New Project**.
- Enter a **Project Name** (e.g., "MeraKiraana") and select your **Organization** (optional).
- Click **Create**.

### 2. Enable People API (Previously Google+ API)

- In the Google Developer Console, navigate to **API & Services** > **Library**.
- Search for **People API** and click on it.
- Click **Enable** to activate the API for your project.

### 3. Create OAuth 2.0 Credentials

- In the **API & Services** dashboard, click on **Credentials** from the left-hand menu.
- Click **Create Credentials** and select **OAuth 2.0 Client IDs**.
- If prompted to configure the OAuth consent screen:
  - Choose **External** and click **Create**.
  - Fill out the required fields like **App Name**, **User Support Email**, and **Developer Contact Information**.
  - Click **Save and Continue** (you can skip the scopes and test users for now).
  - Click **Save and Continue** and return to the dashboard.
- Under **Create OAuth 2.0 Client IDs**, select **Web Application**.
  - Add a **Name** (e.g., "MeraKiraana Web App").
  - Under **Authorized Redirect URIs**, add http://localhost:5000/auth/google/callback (or your deployed URL).
  - Click **Create**.

### 4. Download OAuth Credentials

- Once created, Google will generate a **Client ID** and a **Client Secret**.
- Download the credentials or copy the **Client ID** and **Client Secret** for later use.
## Instructions

### Create Admin User

1. Navigate to the route `/admin/create` to create an admin user.

### Login as Admin

1. Go to `/admin/login` to log in using the following credentials:
   - **Username**: anzer1255ubaid@gmail.com
   - **Password**: Anzer@123

### Manage Products and Categories

1. Once logged in as admin, use the admin dashboard to create products and categories via the provided form.
2. Visit the admin product page to view and manage the products in the database.
3. You can also delete products from this page.

### User Interface

1. Navigate to the `/` route to access the user interface.
2. Use the **Login** button to log in as a regular user.
3. Browse all available products, add items to the cart, and manage your cart.
4. Perform payments in test mode using Razorpay.

### Finalize Order

1. After successfully completing the payment, you will be redirected to a map page.
2. Enter your address and click **Get Order** to place the order in the database.


The application will now be running at http://localhost:5000.

