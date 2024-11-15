import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  Button,
  Container,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [newfirstName, setNewFirstName] = useState("");
  const [newlastName, setNewLastName] = useState("");
  const [newemail, setNewEmail] = useState("");
  const [newphoneNumber, setNewPhoneNumber] = useState("");
  const [newcompany, setNewCompany] = useState("");
  const [newjobTitle, setNewJobTitle] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const columns = [
    { id: "id", name: "Index" },
    { id: "firstName", name: "First Name" },
    { id: "lastName", name: "Last Name" },
    { id: "email", name: "Email" },
    { id: "phoneNumber", name: "Phone Number" },
    { id: "company", name: "Company" },
    { id: "jobTitle", name: "Job Title" },
    { id: "actions", name: "Actions" },
  ];
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [order, setOrder] = useState("ASC");

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        await axios
          .get(`http://localhost:5000/contacts?user=${loggedInUser}`)
          .then((response) => {
            setContacts(response.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };

    if (loggedInUser) fetchContacts();
  }, [loggedInUser]);

  const handleLogout = (e) => {
    handleSuccess("User Logged Out.");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleAddContact = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNumber) {
      handleError("Enter all necessary details.");
      return;
    }

    const flag = contacts.find(
      (contact) => contact.phoneNumber === phoneNumber
    );

    if (flag !== undefined) {
      handleError("Contact with same phone number already exists.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setCompany("");
      setJobTitle("");
      return;
    }

    const data = {
      storedBy: loggedInUser,
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      jobTitle,
    };

    console.log(data);

    axios
      .post("http://localhost:5000/contacts", data)
      .then((result) => {
        handleSuccess("Contact created successfully.");
        setContacts((prev) => [...prev, result.data]);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setCompany("");
        setJobTitle("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const handleEditInitialise = (index) => {
    setEditIndex(index);
    setNewFirstName(contacts[index].firstName);
    setNewLastName(contacts[index].lastName);
    setNewEmail(contacts[index].email);
    setNewPhoneNumber(contacts[index].phoneNumber);
    setNewCompany(contacts[index].company);
    setNewJobTitle(contacts[index].jobTitle);
  };

  const handleEditChange = (e, i) => {
    if (i === 1) setFirstName(e.target.value);
    else if (i === 2) setNewLastName(e.target.value);
    else if (i === 3) setNewEmail(e.target.value);
    else if (i === 4) setNewPhoneNumber(e.target.value);
    else if (i === 5) setNewCompany(e.target.value);
    else if (i === 6) setNewJobTitle(e.target.value);
  };

  const handleEditContact = (index) => {
    if (!newfirstName || !newlastName || !newemail || !newphoneNumber) {
      handleError("Enter all necessary details.");
      return;
    }

    const id = contacts[index]._id;

    console.log(id);

    const data = {
      storedBy: loggedInUser,
      newfirstName,
      newlastName,
      newemail,
      newphoneNumber,
      newcompany,
      newjobTitle,
    };

    axios
      .put(`http://localhost:5000/contacts/${id}`, data)
      .then((result) => {
        if (result.data.message === "Internal server error")
          handleSuccess("Internal server error");
        else {
          handleSuccess("Contact editted successfully.");
          setEditIndex(-1);

          const updatedContacts = [...contacts];
          updatedContacts[index].firstName = newfirstName;
          updatedContacts[index].lastName = newlastName;
          updatedContacts[index].email = newemail;
          updatedContacts[index].phoneNumber = newphoneNumber;
          updatedContacts[index].company = newcompany;
          updatedContacts[index].jobTitle = newjobTitle;

          setContacts(updatedContacts);
          console.log(result.data.message);
        }

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteContact = async (index) => {
    const deleteContact = async () => {
      const id = contacts[index]._id;

      axios
        .delete(`http://localhost:5000/contacts/${id}`)
        .then((result) => {
          handleSuccess(result.data.message);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        })
        .catch((err) => console.log(err));
    };

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteContact(index),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handlePageChange = (e, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (e) => {
    setRowPerPage(+e.target.value);
    setPage(0);
  };

  const handleSorting = (column) => {
    console.log(column);
    if (order === "ASC") {
      const sortedData = [...contacts].sort((a, b) =>
        a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
      );

      setContacts(sortedData);
      setOrder("DSC");
    } else {
      const sortedData = [...contacts].sort((a, b) =>
        a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
      );

      setContacts(sortedData);
      setOrder("ASC");
    }
  };

  return (
    <Container sx={{ marginTop: 5, maxWidth: "100%" }}>
      <Grid2 container spacing={2}>
        <Grid2 size={3}>
          <Typography variant="h5" sx={{ textAlign: "left" }}>
            Hi {loggedInUser}
          </Typography>
        </Grid2>

        <Grid2 size={7}>
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleLogout}>
            Logout
          </Button>
        </Grid2>
      </Grid2>

      <Paper elevation={10} sx={{ marginTop: 5, padding: 3, marginBottom: 5 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={5} sx={{ ml: 5, mb: 2, mr: 10 }}>
            <Typography>*Enter first name:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={5} sx={{ mb: 2 }}>
            <Typography>*Enter last name:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={5} sx={{ ml: 5, mb: 2, mr: 10 }}>
            <Typography>*Enter email:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={5} sx={{ mb: 2 }}>
            <Typography>*Enter phone number:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="+91 99999 99999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={5} sx={{ ml: 5, mb: 2, mr: 10 }}>
            <Typography>Enter company:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="Samsung"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Grid2 size={5} sx={{ mb: 2 }}>
            <Typography>Enter job title:</Typography>
            <TextField
              variant="standard"
              type="text"
              placeholder="Software Developer Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              fullWidth
            />
          </Grid2>

          <Button
            variant="contained"
            onClick={(e) => handleAddContact(e)}
            sx={{ ml: 4 }}
            style={{
              backgroundColor: "#7cdb4d",
            }}
          >
            Add Contact
          </Button>
        </Grid2>
      </Paper>

      <Typography sx={{ mb: 2 }}>
        (Click on column name to sort data.)
      </Typography>

      <Paper elevation={10} sx={{ maxWidth: "100%" }}>
        <TableContainer sx={{ maxWidth: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  return (
                    <TableCell
                      key={column.id}
                      style={{ backgroundColor: "black", color: "white" }}
                      onClick={() => handleSorting(column.id)}
                    >
                      {column.name}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {loggedInUser &&
                contacts &&
                contacts
                  .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                  .map((contact, index) => {
                    if (index === editIndex)
                      return (
                        <TableRow key={index}>
                          {columns &&
                            columns.map((column, i) => {
                              if (column.name === "Index")
                                return (
                                  <TableCell key={index}>
                                    {index + 1 + page * rowPerPage}.
                                  </TableCell>
                                );
                              else if (column.name === "Actions") {
                                return (
                                  <>
                                    <Button
                                      variant="contained"
                                      sx={{ width: 5, mr: 1, mt: 1 }}
                                      onClick={() => handleEditContact(index)}
                                      style={{
                                        backgroundColor: "#78c452",
                                      }}
                                    >
                                      <CheckIcon />
                                    </Button>

                                    <Button
                                      onClick={() => setEditIndex(-1)}
                                      variant="outlined"
                                      sx={{ mt: 1 }}
                                      style={{
                                        color: "red",
                                        borderColor: "red",
                                      }}
                                    >
                                      <CloseIcon />
                                    </Button>
                                  </>
                                );
                              } else {
                                let value = contact[column.id];
                                return (
                                  <TableCell key={value}>
                                    <TextField
                                      sx={{ height: 100 }}
                                      size="small"
                                      variant="filled"
                                      type="text"
                                      value={
                                        i === 1
                                          ? newfirstName
                                          : i === 2
                                          ? newlastName
                                          : i === 3
                                          ? newemail
                                          : i === 4
                                          ? newphoneNumber
                                          : i === 5
                                          ? newcompany
                                          : newjobTitle
                                      }
                                      onChange={(e) => handleEditChange(e, i)}
                                      fullWidth
                                    />
                                  </TableCell>
                                );
                              }
                            })}
                        </TableRow>
                      );
                    else
                      return (
                        <TableRow key={index}>
                          {columns &&
                            columns.map((column, i) => {
                              if (column.name === "Index")
                                return (
                                  <TableCell key={index}>
                                    {index + 1 + page * rowPerPage}
                                  </TableCell>
                                );
                              else if (column.name === "Actions") {
                                return (
                                  <>
                                    <Button
                                      variant="contained"
                                      onClick={() =>
                                        handleEditInitialise(index)
                                      }
                                      sx={{ width: 5, mr: 1, mt: 1 }}
                                      style={{
                                        backgroundColor: "#78c452",
                                      }}
                                    >
                                      <EditIcon />
                                    </Button>

                                    <Button
                                      variant="outlined"
                                      onClick={() => handleDeleteContact(index)}
                                      sx={{ mt: 1 }}
                                      style={{
                                        color: "red",
                                        borderColor: "red",
                                      }}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </>
                                );
                              } else {
                                let value = contact[column.id];
                                return (
                                  <TableCell key={value}>{value}</TableCell>
                                );
                              }
                            })}
                        </TableRow>
                      );
                  })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowPerPage}
          page={page}
          count={contacts.length}
          component="div"
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>

      <ToastContainer />
    </Container>
  );
};

export default Dashboard;
