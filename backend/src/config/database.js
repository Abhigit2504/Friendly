const mongoose = require("mongoose");

const connnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhi123:%40Abhi1432@cluster0.q4srm.mongodb.net/Friendly?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = connnectDB;
// mongodb+srv://admin:abhi1234@clusterdata1.9yxs4.mongodb.net/Friendly?retryWrites=true&w=majority&appName=Clusterdata1
