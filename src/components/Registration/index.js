import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  FormControl,
  FormHelperText,
  Typography,
  Card,
  CardContent,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import { isValidEmail, isValidMobile } from "../../utils/validate";
import { departments, roles } from "../../utils/dummyData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Register = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: null,
    doj: null,
    description: "",
    role: "",
    department: departments[0],
  });

  const [submitted, setSubmitted] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/get_user/${id}`);
          setValues({
            ...response.data.user,
            dob: response.data.user.dob ? dayjs(response.data.user.dob) : null,
            doj: response.data.user.doj ? dayjs(response.data.user.doj) : null,
          });
        } catch (error) {
          console.error("Error fetching user data for editing:", error);
        }
      };

      fetchUserData();
    }
  }, [id]);

  console.log(values);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  console.log(values);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !isValidEmail(values.email) ||
      !values.mobile ||
      !isValidMobile(values.mobile) ||
      !values.gender ||
      !values.dob ||
      !values.doj ||
      !values.description ||
      !values.role ||
      !values.department
    ) {
      return;
    }

    try {
      const response = id
        ? await axios.put(`${apiUrl}/api/update_user/${id}`, values)
        : await axios.post(`${apiUrl}/api/register`, values);

      if (response.data.success === true) {
        setRegistrationStatus("success");
        navigate("/");
      } else {
        setRegistrationStatus("failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationStatus("error");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card
          sx={{
            boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.4)",
          }}
        >
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              User Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    error={submitted && !values.firstName}
                    helperText={
                      submitted &&
                      !values.firstName &&
                      "Please enter your first name"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    error={submitted && !values.lastName}
                    helperText={
                      submitted &&
                      !values.lastName &&
                      "Please enter your last name"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={
                      submitted &&
                      (!values.email || !isValidEmail(values.email))
                    }
                    helperText={
                      submitted &&
                      (!values.email
                        ? "Please enter your email address"
                        : !isValidEmail(values.email)
                        ? "Please enter a valid email address"
                        : "")
                    }
                    disabled={!!id}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleInputChange}
                    fullWidth
                    error={
                      submitted &&
                      (!values.mobile || !isValidMobile(values.mobile))
                    }
                    helperText={
                      submitted &&
                      (!values.mobile
                        ? "Please enter your mobile number"
                        : !isValidMobile(values.mobile)
                        ? "Please enter a valid 10-digit mobile number"
                        : "")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={submitted && !values.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      value={values.gender}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {submitted && !values.gender && (
                      <FormHelperText>Please select your gender</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={submitted && !values.role}>
                    <InputLabel>Select Role</InputLabel>
                    <Select
                      name="role"
                      label="Select Role"
                      value={values.role}
                      onChange={handleInputChange}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                    {submitted && !values.role && (
                      <FormHelperText>Please select your role</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Date of Birth"
                        onChange={(newValue) => {
                          setValues({ ...values, dob: newValue });
                        }}
                        value={values?.dob}
                        name="dob"
                        slotProps={{
                          textField: {
                            error: submitted && !values.dob,
                            helperText:
                              submitted && !values.dob
                                ? "Please select your date of birth"
                                : "",
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Date of Joining"
                        onChange={(newValue) => {
                          setValues({ ...values, doj: newValue });
                        }}
                        name="doj"
                        value={values?.doj}
                        slotProps={{
                          textField: {
                            error: submitted && !values.doj,
                            helperText:
                              submitted && !values.doj
                                ? "Please select your date of joining"
                                : "",
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    fullWidth
                    error={submitted && !values.description}
                    helperText={
                      submitted &&
                      !values.description &&
                      "Please add some description"
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={departments}
                    name="department"
                    onChange={(event, newValue) => {
                      setValues({
                        ...values,
                        department: newValue,
                      });
                    }}
                    value={values.department}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department"
                        fullWidth
                        error={submitted && !values.department}
                        helperText={
                          submitted &&
                          !values.department &&
                          "Please select your department"
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {id ? "Update User" : "Add User"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            {registrationStatus === "failed" && (
              <Typography
                variant="body1"
                align="center"
                color="error"
                gutterBottom
              >
                User already registered. Please use a different email or mobile.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
