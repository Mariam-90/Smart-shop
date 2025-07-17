const router = require("express").Router();
const { User } = require("../models/user");
const locationRoutes = require('./location');
const bcrypt = require("bcrypt");
const axios = require("axios");
const Joi = require("joi");
const GEOLOCATION_API_KEY = process.env.GEOLOCATION_API_KEY;

const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");




router.post('/login', async (req, res) => {
  try {
    // אם המשתמש קיים כבר במסד הנתונים, עדכן את המיקום שלו
    // אחרת, צור משתמש חדש ושמור את המיקום שלו
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log('before request: exist user')
      // אם המשתמש כבר קיים, עדכן את המיקום שלו
      const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD7sThIqQdDD1bIe6t--VIpuS-cLOcQKJQ`);

      const location = response.data.location;
      console.log(location)

      await User.findByIdAndUpdate(existingUser._id, { location });
    } else {
      // אחרת, צור משתמש חדש ושמור את המיקום שלו
      const newUser = new User({
        email: req.body.email,
        password: req.body.password // נאמנה שהסיסמה תתקבל מה-req.body, עליך לוודא אימות והצפנה מתאימים
      });
      console.log('before request: new user')
      const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD7sThIqQdDD1bIe6t--VIpuS-cLOcQKJQ`);
      const location = response.data.location;
      newUser.location = location; // הגדרת המיקום של המשתמש החדש
      console.log(location)
      await newUser.save();
    }

    res.status(200).json({ success: true, message: 'Location received successfully.' });
  } catch (error) {
    console.error('Error getting location:', error);
    res.status(500).json({ success: false, message: 'Error getting location.' });
  }

});
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}api/users/${user.id}/verify/${token.token}`;
        html = "<a href=" + url + ">לחץ כאן לאימות מייל</a>"
        await sendEmail(user.email, "Verify Email", html);
      }

      return res
        .status(400)
        .send({ message: "מייל נשלח אליך, אנא אשר את המייל שלך" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: user, message: "logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label("Email"),
    password: Joi.string()
      .required()
      .label("Password"),
  });
  return schema.validate(data);
};

router.get('/', (req, res) => {
  MyModel.find({}, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.send(data);
    }
  });
});

module.exports = router;