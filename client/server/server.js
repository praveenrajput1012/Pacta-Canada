require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "https://pacta-canada-n1zy.vercel.app", // ✅ Frontend URL
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/search", require("./routes/search"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
