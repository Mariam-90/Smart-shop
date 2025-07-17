const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const multer = require('multer');
const path = require('path');
const { Content } = require("../models/content");
const { Message } = require('../models/message'); // ייבוא מודל ההודעה

router.get("/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    let user = await User.findOne({ email });
    user = user.toObject();
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/id/:id", async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).send({ message: "User with given ID doesn't exist!" });
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/tzunai/toggle", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).send({ message: "User with given ID doesn't exist!" });
    currentIsTzunai = user.isTzunai;
    user.isTzunai = !currentIsTzunai;
    await user.save();
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/favorites/update", async (req, res) => {
  try {
    const { id, contentId } = req.body;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).send({ message: "User with given ID doesn't exist!" });
    const content = await Content.findById(contentId);
    if (!content)
      return res.status(404).send({ message: "content with given ID doesn't exist!" });

    const diff = user.favoriteContents.includes(contentId) ? -1 : 1;
    user.favoriteContents = user.favoriteContents.includes(contentId) ? user.favoriteContents.replace(` ${contentId}`, "") : user.favoriteContents + ` ${contentId}`;
    content.heartCount += diff;

    await user.save();
    await content.save();

    res.status(200).send({ message: "Favorite mark toggled", diff: diff });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/favorites/list", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).send({ message: "User with given ID doesn't exist!" });

    res.status(200).send({ message: "returned favorites", favouriteContents: user.favoriteContents.split(" ") });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});







// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// נתיב לקבלת הודעות מהטופס
router.post('/api/contact', upload.array('files'), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const files = req.files.map(file => file.path);

    const newMessage = new Message({ name, email, message, files });
    await newMessage.save();

    res.status(200).json({ message: 'Message received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error receiving message' });
  }
});

// נתיב להצגת ההודעות למנהל
router.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.put('/update/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      location: JSON.parse(req.body.location),
    };
    if (req.file) {
      updateData.profilePictureUrl = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/admin/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) return res.status(404).send('User not found');
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/basket/update", async (req, res) => {
  console.log("Basket update route hit");
  try {
    const { id, basket, basketId } = req.body;
    console.log("Request body:", req.body);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User with given ID doesn't exist!" });
    }

    if (basketId >= 0 && basketId < user.baskets.length) {
      user.baskets[basketId].products = basket; // עדכן את שדה ה-products בלבד
      await user.save();
      return res.status(200).send({ message: "Basket updated", baskets: user.baskets });
    } else {
      return res.status(404).send({ message: "Basket with given ID doesn't exist!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});





// מסלול להוספת רשימה חדשה
router.post("/basket/add", async (req, res) => {
  try {
    const { id, basket } = req.body;
    console.log("Basket add route hit"); // הודעת לוג
    console.log("Request body:", req.body); // הודעת לוג
    
    // וודא שה-id וה-basket נשלחים
    if (!id || !basket) {
      console.error("ID or basket is missing in the request body.");
      return res.status(400).send({ message: "ID or basket is missing in the request body." });
    }

    const user = await User.findById(id);
    if (!user) {
      console.error("User not found");
      return res.status(404).send({ message: "User with given ID doesn't exist!" });
    }

    if (!Array.isArray(user.baskets)) {
      console.error("Baskets is not an array");
      return res.status(500).send({ message: "Baskets is not an array" });
    }

    user.baskets.push(basket);
    await user.save();

    console.log("Basket added successfully");
    res.status(200).send({ message: "Basket added successfully" });
  } catch (error) {
    console.error("Error adding basket:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



// Delete basket
router.post("/basket/delete", async (req, res) => {
  try {
    const { id, basketIndex } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ message: "User with given ID doesn't exist!" });

    if (basketIndex >= 0 && basketIndex < user.baskets.length) {
      user.baskets.splice(basketIndex, 1);
      await user.save();
      return res.status(200).send({ message: "Basket removed", baskets: user.baskets });
    } else {
      return res.status(404).send({ message: "Basket with given ID doesn't exist!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});// Get user lists
// נתיב לקבלת כל הרשימות של המשתמש
router.post('/basket/list', async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ baskets: user.baskets });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.get('/lists', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // הדפסת הרשימות לקבלת מידע נוסף על המבנה
    console.log('Fetched lists:', user.baskets); 
    res.status(200).json(user.baskets);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).send('Server error');
  }
});



const fetchListsForUser = async (userId) => {
    // Your logic to fetch lists from database for the given userId
    // Return lists as an array
};



// Add product to list
// Server-side code




// נתיב להוספת מוצר לרשימה קיימת

router.post("/add-to-list", async (req, res) => {
  try {
    const { userId, listId, product } = req.body;
    console.log("Add to list route hit");
    console.log("Request body:", req.body);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found" });
    }

    let basket = user.baskets.id(listId);
    if (basket) {
      // Update existing list
      basket.products.push(product);
      console.log(`Added product to existing list: ${basket.name}`);
    } else {
      // Create new list
      const newBasket = { name: listId, products: [product] };
      user.baskets.push(newBasket);
      console.log(`Created new list: ${listId}`);
      basket = newBasket;
    }

    await user.save();
    res.status(200).send({ message: "Product added to list successfully", baskets: user.baskets, newListId: basket._id });
  } catch (error) {
    console.error("Error adding product to list", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



module.exports = router;
