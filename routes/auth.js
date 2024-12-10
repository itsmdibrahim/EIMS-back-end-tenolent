const express = require("express");
const { auth } = require("../middleware/auth");
const {
  authRegister,
  authLogin,
  authGetUserInfo,
  authChangeUserProfile,
  authChangeUserAccount,
  authForgotPassword,
  authVerifyCode,
  authPasswordUpdate,
  authUsersGet,
  authDeleteUser,
  authFacultyStatusUpdate,
} = require("../controller/auth");

const router = express.Router();

// Register route
router.post("/register", authRegister);
// Login route
router.post("/login", authLogin);
// change account route
router.put("/profile/update/:id", auth, authChangeUserProfile);
// change account route
router.put("/account/update/:id", auth, authChangeUserAccount);
//get a user info
router.get("/get/:id", auth, authGetUserInfo);
//get all users
router.get("/users/get", auth, authUsersGet);
//get all users
router.delete("/delete/user/:delId", auth, authDeleteUser);
//update faculty status of a user users
router.put("/faculty-status-update/:userId", auth, authFacultyStatusUpdate);
// Forgot password
router.post("/forgot-password", authForgotPassword);
// verify code
router.post("/verify-code", authVerifyCode);
// password update
router.post("/password-update", authPasswordUpdate);

module.exports = router;
