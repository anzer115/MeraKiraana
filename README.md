## Setup
1. Clone the repository.
2. Create a .env file in the root directory and add the following valiables:

MONGOURL=your-mongodb-url
   
GOOGLE_CLIENT_ID=your-google-client-id

GOOGLE_CLIENT_SECRET=your-google-client-secret

GOOGLE_CALLBACK_URL=your-google-callback-url

EXPRESS_SECRET=your-express-session-secret

NODE_ENV=DEVELOPMENT

JWT_KEY=your-jwt-key

RAZORPAY_KEY_ID=your-razorpay-key-id

RAZORPAY_KEY_SECRET=your-razorpay-key-secret.

## Instructions
   
Create Admin User:

Navigate to the route /admin/create to create an admin user.
Login as Admin:

Go to /admin/login to log in using the credentials:
Username: anzer1255ubaid@gmail.com
Password: Anzer@123

Manage Products and Categories:

Use the admin dashboard to create products and categories via the provided form.
Visit the admin product page to view and manage the products in the database.
You can also delete products from this page.
User Interface:

Go to the / page to access the user interface.
Use the login button to log in.
Browse all available products, add items to the cart, and manage the cart.
Perform payments in test mode using Razorpay.

Finalize Order:

After completing the payment, you will be redirected to a map page.
Enter your address and click "Get Order" to create the order in the database.
   
