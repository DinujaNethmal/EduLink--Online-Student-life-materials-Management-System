const mongoose = require('mongoose');
const uri = "mongodb+srv://dinujanethmal119_db_user:n8ZHGoWOtXU6e1wx@edulink-cluster.qb8qsmb.mongodb.net/?appName=EduLink-Cluster";

console.log("Testing connection to:", uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Connection failed.");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.reason) console.error("Reason:", err.reason);
    process.exit(1);
  });
