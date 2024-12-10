const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");
const nodemailer = require("nodemailer");
const eraseResetCodeTimeLimit = 1;

function getPayload(user) {
  return {
    user: {
      id: user.id,
      userType: user.userType,
      name: user.name ? user.name : ``,
      contact: user.contact ? user.contact : ``,
      address: user.address ? user.address : ``,
      email: user.email,
    },
  };
}
function generate6CharacterCode() {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const authRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Auth.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    user = new Auth(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = getPayload(user);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err, err.message);
    res.status(500).send("Server error");
  }
};

const authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Auth.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = getPayload(user);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 * 24 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const authGetUserInfo = async (req, res) => {
  let { id } = req.params;

  try {
    let user = await Auth.findById(id).select(
      "totalSpends totalFare totalIncome createdAt"
    );
    if (user) {
      res.status(200).json(user);
    } else {
      throw Error("no user found!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const authUsersGet = async (req, res) => {
  try {
    let users = await Auth.find();
    if (users) {
      res.status(200).json({ data: users });
    } else {
      throw Error("no user found!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const authDeleteUser = async (req, res) => {
  const { delId } = req.params;

  try {
    let result = await Auth.findByIdAndDelete(delId);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const authFacultyStatusUpdate = async (req, res) => {
  const { userId } = req.params;

  try {
    let result = await Auth.findByIdAndUpdate(
      userId,
      {
        $set: { userType: req.body.isFaculty ? `student` : `faculty` },
      },
      { new: true }
    );
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const authChangeUserProfile = async (req, res) => {
  let { id } = req.params;
  let { firstName, lastName } = req.body;

  try {
    let user = await Auth.findByIdAndUpdate(
      id,
      {
        $set: { firstName, lastName },
      },
      { new: true }
    );

    if (user) {
      res.status(200).json({
        data: { contact: user.contact, address: user.address },
        message: "data updated!",
      });
    } else {
      throw Error("no user found!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const authChangeUserAccount = async (req, res) => {
  let { id } = req.params;
  let { oldPassword, password } = req.body;

  let user = await Auth.findById(id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await Auth.findByIdAndUpdate(
        id,
        {
          $set: { password: hashedPassword },
        },
        { new: true }
      );

      res.status(200).json({
        data: true,
        message: "data updated",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

const authForgotPassword = async (req, res) => {
  let { email } = req.body;

  let user = await Auth.findOne({ email });

  if (user == null) {
    return res.status(400).json({ message: "Invalid Email" });
  } else {
    let code = generate6CharacterCode();

    try {
      //send varification code
      await Auth.findOneAndUpdate(
        { email },
        {
          $set: { resetCode: code },
        }
      );

      // Create a transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail", // or another email service
        host: process.env.SMTP_HOST, // Replace with your SMTP server
        port: Number(process.env.SMTP_PORT), // Typically 587 for TLS, 465 for SSL
        secure: Number(process.env.SMTP_PORT) == 465, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // Replace with your email address
          pass: process.env.EMAIL_PASS, // Replace with your email password
        },
      });

      // Send email with defined transport object
      await transporter.sendMail({
        from: `"House Wallet varification code" <${process.env.EMAIL_USER}>`, // Sender address
        sender: process.env.EMAIL_USER, // List of recipients
        to: email.trim(), // Sender address
        subject: "House Wallet varification code", // Subject line
        html: `<h3>varification code: ${code}</h3>`, // Plain text body
      });

      res.status(200).json({
        data: true,
        message: "Sent Code",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

const authVerifyCode = async (req, res) => {
  let { code, email } = req.body;

  let user = await Auth.findOne({ email });

  if (user == null) {
    return res.status(400).json({ message: "Invalid Email" });
  } else {
    try {
      //send varification code

      if (user.resetCode == code) {
        setTimeout(async () => {
          await Auth.findOneAndUpdate(
            { email },
            {
              $set: { resetCode: `` },
            }
          );
        }, eraseResetCodeTimeLimit * 60 * 1000);

        res.status(200).json({
          data: true,
          message: "Code Matched",
        });
      } else {
        res.status(400).json({ message: "Code Do Not Match" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

const authPasswordUpdate = async (req, res) => {
  let { newPassword, code, email } = req.body;

  let user = await Auth.findOne({ email });

  if (user == null) {
    return res.status(400).json({ message: "Invalid Email" });
  } else {
    try {
      //send varification code

      if (user.resetCode == code) {
        const salt = await bcrypt.genSalt(10);
        let saltedPass = await bcrypt.hash(newPassword, salt);

        await Auth.findOneAndUpdate(
          { email },
          {
            $set: { password: saltedPass },
          }
        );

        res.status(200).json({
          data: true,
          message: "Password Updated",
        });
      } else {
        res.status(400).json({ message: "Do Not Match" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

module.exports = {
  authRegister,
  authLogin,
  authGetUserInfo,
  authUsersGet,
  authDeleteUser,
  authFacultyStatusUpdate,
  authChangeUserProfile,
  authChangeUserAccount,
  authForgotPassword,
  authVerifyCode,
  authPasswordUpdate,
};
