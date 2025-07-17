const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = async () => {
  try {
    const connectionUri = process.env.DB; // 
    if (!connectionUri) {
      throw new Error("DB connection string is missing in .env file");
    }

    await mongoose.connect(connectionUri);

    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the application on database connection error
  }
};
