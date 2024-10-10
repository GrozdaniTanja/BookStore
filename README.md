# Bookstore

Webshop application developed using ReactJS, CSS, React-Bootstrap, Font Awesome Icons.

Live demo on Vercel:
https://book-store-frontend-delta-tawny.vercel.app/

### Application has two main components:

- REST API (webshop-api)
- Client App (webshop-app)

### Functionalities:

- Register and login forms
- Search Books
- Filter Books
- Administrator role for deleting, editing and adding books, delete accounts, view all orders
- Validations
- Edit profile information
- Breadcrumbs
- Shopping cart
- Purchase books
- Order History

## Install and Run Instructions

### 1. Install Nodemon Globally

Nodemon is a tool that automatically restarts your Node.js application when file changes are detected. To install it globally, run:

```
npm install -g nodemon
```

### 2. Install Dependencies

Navigate to both the webshop-api and webshop-app directories and install their dependencies:

```
npm install
```

### 3. Set Up Environment Variables

- In the root of the webshop-app directory, create a .env file and add the following:
  ```
  REACT_APP_API_URL=http://localhost:3001
  ```
- In the root of the webshop-api directory, create another .env file and add the MongoDB connection string:
  ```
  MONGODB_URI='mongodb+srv://newuser:RUqqvw3rI4QIzTJP@bookstore-react-app.vzalg.mongodb.net/?retryWrites=true&w=majority&appName=bookstore-react-app
  ```

### 4. Run the Application

- Start the REST API:
  In the webshop-api folder, run: `npm start`. The REST API will be available at http://localhost:3001.

- Start the Client Application:
  In the webshop-app folder, run: `npm start`. Open http://localhost:3000 in your browser to view the client application.
