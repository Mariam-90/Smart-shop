const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

// Helper function for handling errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).send({ message });
};

// Initiate password reset process
router.post("/", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });

    const { error } = emailSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return handleError(res, 409, "User with given email does not exist!");
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}/`;
    await sendEmail(user.email, "Password Reset", url);

    res.status(200).send({ message: "Password reset link sent to your email account" });
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Internal Server Error");
  }
});

// Verify password reset link
router.get("/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const token = await Token.findOne({
      userId: user?._id,
      token: req.params.token,
    });

    if (!user || !token) {
      return handleError(res, 400, "Invalid link");
    }

    res.status(200).send("Valid Url");
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Internal Server Error");
  }
});

// Set new password
router.post("/:id/:token", async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });

    const { error } = passwordSchema.validate(req.body);
    if (error) {
      return handleError(res, 400, error.details[0].message);
    }

    const user = await User.findOne({ _id: req.params.id });
    const token = await Token.findOne({
      userId: user?._id,
      token: req.params.token,
    });

    if (!user || !token) {
      return handleError(res, 400, "Invalid link");
    }

    if (!user.verified) {
      user.verified = true;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;
    await user.save();
    await token.remove();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    handleError(res, 500, "Internal Server Error");
  }
});

module.exports = router;
