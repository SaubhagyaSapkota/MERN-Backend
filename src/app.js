const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

const mongoDbURI = "mongodb://127.0.0.1:27017/lec";
mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  fullname: String,
  password: String,
  title: String,
  skills: [{ type: String }],
  address: String,
  job_type: String,
  id: Number,
  is_active: Boolean,
  followers: [{ type: String }],
  followings: [{ type: String }],
});

const User = mongoose.model("user", userSchema);

const postsSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  job_type: String,
  pay_rate_per_hr_dollar: Number,
  skills: [{ type: String }],
  liked_by: [{ type: String }],
  viewed_by: [{ type: String }],
  id: Number,
  user_id: Number,
  post_by_username: String,
  post_by_fullname: String,
  post_date: String,
  comments: [],
});

const Posts = mongoose.model("posts", postsSchema);

// Posts.create({
//   title: "PHP Developer Required",
//   description: "For a client project PHP Developer is required",
//   location: "Kathmandu",
//   job_type: "Full Time",
//   pay_rate_per_hr_dollar: 10.0,
//   skills: ["PHP", "JS", "HTML"],
//   liked_by: ["test111", "test1", "test123"],
//   viewed_by: ["test111", "test1", "test123"],
//   id: 2,
//   user_id: 1,
//   post_by_username: "me",
//   post_by_fullname: "Saubhagya Sapkota 1",
//   post_date: "2023-06-10T09:24:07.659034",
//   comments: [],
// }).then(() => {
//   console.log("Posts Created");
// });

app.get("/", (req, res) => {
  res.status(200).send("This is response from BE");
});

// read file and send content of file as response
app.get("/api/v1/posts", (req, res) => {
  const posts = fs.readFileSync("./data/posts.json", "utf-8").toString();
  res.status(200).send(posts);
});
app.get("/api/v1/user", async (req, res) => {
  const user = await User.find({ id: 1 });
  //const user = fs.readFileSync("./data/user.json", "utf-8").toString();
  res.status(200).send(user[0]);
});

app.post("/api/v1/user", async (req, resp) => {
  const lastUser = await User.findOne({}, null, { sort: { id: -1 } });

  const {
    username,
    email,
    fullname,
    title,
    job_type,
    skills,
    address,
    password,
  } = req.body;
  let id = 1;
  if (lastUser) {
    id = lastUser.id + 1;
  }
  const newUser = {
    email,
    password,
    username,
    fullname,
    title,
    skills,
    address,
    job_type,
    id,
    is_active: true,
    followers: [],
    followings: [],
  };

  User.create(newUser).then((createdUser) => {
    console.log("User Created");
    resp.status(200).send(createdUser);
  });
});

app.listen(PORT, () => {
  console.log("App is running on " + PORT);
});
