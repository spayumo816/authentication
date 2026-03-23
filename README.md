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
configs/
  db.js

controllers/
  authController.js

models/
  userModel.js
  residentModel.js
  lguAdminModel.js
  collectorModel.js

routes/
  authRoutes.js

middleware/
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

## 📧 How to Get Brevo API Key (Email Setup)

This project uses **Brevo (formerly Sendinblue)** to send OTP emails.

Follow these steps to set it up:

### 1. Create a Brevo Account

Go to:
👉 https://www.brevo.com/

Sign up for a free account.

---

### 2. Generate API Key

1. Log in to your Brevo dashboard
2. Go to **SMTP & API**
3. Click **API Keys**
4. Click **Generate a new API key**
5. Copy the generated key (starts with `xkeysib-`)

---

### 3. Verify Sender Email

1. Go to **Senders & Domains**
2. Click **Add a sender**
3. Enter your email address
4. Verify it via the email Brevo sends you

⚠️ **Important:**
Emails will NOT send if the sender email is not verified.

---

### 4. Add to Environment Variables

Update your `.env` file:

```env
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER_EMAIL=your_verified_email@example.com
```

---

### 5. Restart Your Server

After updating `.env`, restart your server:

```bash
npm run dev
```

or redeploy if using Render.

---

## 🛠 Troubleshooting

If OTP email is not sending:

* ❌ API key is missing or incorrect
* ❌ Sender email is not verified
* ❌ `.env` not loaded (restart server)
* ❌ Wrong environment variables in deployment (Render)

---

## 👨‍💻 Contributors

* Stephanie P.
* Robert H.
* Rapp Micco R.
* Byron R.

---

## 📄 License

This project is for academic purposes.
