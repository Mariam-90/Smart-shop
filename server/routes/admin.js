const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

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

module.exports = router;
