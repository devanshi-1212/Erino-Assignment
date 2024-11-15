import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Avatar,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [info, setInfo] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = info;

    if (!email || !password) {
      return handleError("All fields are required.");
    }

    try {
      const url = "https://erino-assignment-2l4y.onrender.com/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/dashboard");
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
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="standard"
            label="Email"
            onChange={handleChange}
            type="email"
            name="email"
            autoFocus
            fullWidth
            required
            sx={{ mb: 2 }}
            value={info.email}
          />

          <TextField
            variant="standard"
            label="Password"
            type="password"
            onChange={handleChange}
            name="password"
            value={info.password}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Typography>
            Don't have an account? <Link to="/signup">Signup</Link>
          </Typography>

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Paper>

      <Typography sx={{ mt: 4, fontSize: 15 }}>
        To try out CRUD operations and see pre-uploaded contacts, you can login
        using this credential -
      </Typography>

      <Typography sx={{ mt: 2, fontSize: 15 }}>
        Email: megumi@gmail.com <br />
        Password: megumi
      </Typography>

      <ToastContainer />
    </Container>
  );
};

export default Login;
