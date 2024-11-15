const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  storedBy: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  jobTitle: {
    type: String,
    required: true,
  },
});

const contactModel = mongoose.model("Contacts", contactSchema);
module.exports = contactModel;
