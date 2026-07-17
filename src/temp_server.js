import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/authentication/auth.js";


const app = express();
const port = process.env.PORT || 3000;




app.all("/api/auth/*path", (req, res) => {
    console.log("Auth used")
    return toNodeHandler(auth)(req, res);
})
/*
The main methods that can be used with better Auth:
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
POST /api/auth/sign-in/google

POST /api/auth/sign-out
POST /api/auth/change-password
POST /api/auth/forget-password
POST /api/auth/reset-password (using token in url)
POST /api/auth/verify-email
POST /api/auth/update-user


GET /api/auth/get-session

/api/auth/callback/google (OAuth callback)

*/
app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


