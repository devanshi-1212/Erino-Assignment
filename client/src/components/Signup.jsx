import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import {
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Avatar,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Signup = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...info };

    updatedInfo[name] = value;
    setInfo(updatedInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = info;

    if (!name || !email || !password) {
      return handleError("All fields are required.");
    }

    try {
      const url = "http://localhost:5000/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 3 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Signup
        </Typography>

        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="standard"
            label="Name"
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            fullWidth
            required
            sx={{ mb: 2 }}
            value={info.name}
          />

          <TextField
            variant="standard"
            label="Email"
            onChange={handleChange}
            type="email"
            name="email"
            value={info.email}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            variant="standard"
            label="Password"
            onChange={handleChange}
            type="password"
            name="password"
            value={info.password}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Typography>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>
            Signup
          </Button>
        </Box>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Signup;
