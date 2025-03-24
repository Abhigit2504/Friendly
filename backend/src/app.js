const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const authRouter = require("./routes/auth.js");
const requestRouter = require("./routes/request.js");
const profileRouter = require("./routes/profile.js");
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration
app.use(cors())
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // Allow credentials (cookies, authentication)
}));

// Handle preflight requests
app.options("*", cors());


app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// ✅ Initialize Socket.io with CORS Fix
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("✅ Database connection established...");
    server.listen(7777, () => {
      console.log("🚀 Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error("❌ Database cannot be connected!", err);
  });
