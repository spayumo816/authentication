# 🚛 Garbage Pickup App – Authentication Module

This repository contains the **Authentication System** for the Garbage Pickup App.
It handles user registration, email verification, login, password reset, and protected routes using JWT.

---

## ✨ Features

* ✅ User Registration (Resident only)
* ✅ Email Verification using OTP (Brevo API)
* ✅ Resend Verification OTP
* ✅ Secure Login with JWT
* ✅ Forgot Password (OTP-based)
* ✅ Reset Password
* ✅ Protected Routes Middleware
* ✅ Input Validation using `express-validator`
* ✅ OTP hashing using `bcrypt`

---

## 🧱 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (jsonwebtoken)**
* **bcrypt**
* **Brevo API (Email Service)**
* **express-validator**

---

## 📁 Project Structure

```
controllers/
  auth/
    authController.js

models/
  userModel.js
  residentModel.js

routes/
  authRoutes.js

middleware/
  auth/
    authMiddleware.js
  validateRequest.js

services/
  otpService.js

utils/
  otpUtils.js
  emailUtils.js

validators/
  authValidator.js
```

---

## 🔐 Authentication Flow

### 1. Register

* Creates user (resident only)
* Generates OTP
* Sends OTP via email (Brevo)

### 2. Verify Email

* User submits OTP
* Account becomes verified
* JWT token is returned

### 3. Login

* Validates credentials
* Returns JWT token

### 4. Forgot Password

* Sends OTP to email

### 5. Reset Password

* Verifies OTP
* Updates password

---

## 📌 API Endpoints

| Method | Endpoint                            | Description           |
| ------ | ----------------------------------- | --------------------- |
| POST   | `/api/auth/register`                | Register new user     |
| POST   | `/api/auth/verify-email`            | Verify email with OTP |
| POST   | `/api/auth/resend-verification-otp` | Resend OTP            |
| POST   | `/api/auth/login`                   | Login user            |
| POST   | `/api/auth/logout`                  | Logout (client-side)  |
| POST   | `/api/auth/forgot-password`         | Send reset OTP        |
| POST   | `/api/auth/reset-password`          | Reset password        |

---

## 📬 Postman Collection

You can test all endpoints using the Postman collection:

👉 Download here:  
`/postman/authRoutes.postman_collection.json`

### How to use:
1. Open Postman
2. Click **Import**
3. Upload the JSON file
4. Set your base URL
5. Test all endpoints

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_email@example.com
```

---

## 🚀 Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Run server

```bash
npm run dev
```

---

## 🔒 Protected Routes

Use the `protect` middleware:

```js
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
```

Add header:

```
Authorization: Bearer YOUR_TOKEN
```

---

## ⚠️ Notes

* Only **resident** can self-register
* OTP expires in **10 minutes**
* Unverified expired accounts are automatically deleted
* Logout is handled on the client by removing the token

---

## 📬 Email Service (Brevo)

This project uses **Brevo API** for sending OTP emails.

Make sure:

* API key is valid
* Sender email is verified in Brevo

---

## 👨‍💻 Contributors

* Your Name
* Teammate Name

---

## 📄 License

This project is for academic purposes.
