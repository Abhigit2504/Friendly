const mongoose = require("mongoose");

const connnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rajakoushik8008:IF9W9APk5LpxiLdi@namastenode.d47qz.mongodb.net/devTinder"
  );
};

module.exports = connnectDB;
// mongodb+srv://admin:abhi1234@clusterdata1.9yxs4.mongodb.net/Friendly?retryWrites=true&w=majority&appName=Clusterdata1