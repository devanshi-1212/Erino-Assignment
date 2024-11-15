const express = require("express");
const connectDB = require("./db.js");
const ContactModel = require("./models/ContactsModel.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  signupValidation,
  loginValidation,
} = require("./middlewares/AuthValidation.js");
const { signup, login } = require("./controllers/AuthController.js");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.post("/login", loginValidation, login);
app.post("/signup", signupValidation, signup);

app.get("/test", (req, res) => {
  res.send("testing application 2");
});

app.get("/contacts", async (req, res) => {
  const user = req.query.user;

  try {
    const users = await ContactModel.find({ storedBy: user });
    if (users) {
      console.log("Contacts found.");
      res.json(users);
    } else {
      console.log("No contacts created by user.");
      res.status(404).json({ message: "No contacts created by user." });
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/contacts", async (req, res) => {
  ContactModel.create(req.body)
    .then((contact) => {
      res.json(contact);
      console.log(contact);
      alert("Contact added successfully.");
    })
    .catch((err) => console.log(err));
});

app.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const updatedContactData = req.body;

  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      updatedContactData,
      { new: true }
    );

    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found." });

    res.json({ message: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/contacts/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact)
      return res.status(404).json({ message: "Contact not found" });

    console.log("Contact deleted successfully");

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Connected to backend on port " + process.env.PORT + ".");
});
