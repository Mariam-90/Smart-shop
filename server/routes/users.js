const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


router.post("/", async (req, res) => {
	try {
	  const { error } = validate(req.body);
	  if (error) return res.status(400).send({ message: error.details[0].message });
  
	  let user = await User.findOne({ email: req.body.email });
	  if (user) return res.status(409).send({ message: "User with given email already exists!" });
  
	  const salt = await bcrypt.genSalt(Number(process.env.SALT));
	  const hashPassword = await bcrypt.hash(req.body.password, salt);
  
	  user = await new User({ ...req.body, password: hashPassword }).save();
  
	  const token = await new Token({
		userId: user._id,
		token: crypto.randomBytes(32).toString("hex"),
	  }).save();
  
	  const url = `${process.env.BASE_URL}/api/users/${user._id}/verify/${token.token}`;
	  console.log("Generated verification URL: ", url);
	  
	  const emailResponse = await sendEmail(user.email, "Verify Email", `Please verify your email by clicking on the following link: ${url}`);
	  if (emailResponse) {
		console.log("Failed to send verification email");
		return res.status(500).send({ message: "Failed to send verification email" });
	  }
	  console.log("users sendEmail done");
  
	  res.status(201).send({ message: "מייל נשלח אליך, אנא אשר את המייל שלך" });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });


router.get("/:id/verify/:token", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id }, { verified: true });
		await Token.deleteOne({ _id: token._id });

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.get("/list/", async (req, res) => {
	try {
		let users = await User.find({}).lean();
		res.json(users);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;