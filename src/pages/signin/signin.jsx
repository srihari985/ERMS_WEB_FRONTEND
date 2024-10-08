import React, { useState } from "react";
import { Button, TextField, Typography, Container, Link, MenuItem,Box, FormControl, InputLabel, Select, FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert for notifications
import { useFormik } from "formik";  // Import useFormik

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url('https://img.freepik.com/premium-photo/abstract-background-design-images-wallpaper-ai-generated_643360-136650.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
      },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    borderRadius: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", 
    backdropFilter: "blur(5px)", 
    maxWidth: "500px",
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(4),
  },
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.85)", 
      borderRadius: "5px",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  },
  label: {
    color: "white",
    marginBottom: theme.spacing(1),
    display: "block",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#FFFFFF",
    fontWeight: "bold",
    backgroundColor: "#53CDB0", 
  },
  link: {
    marginTop: theme.spacing(2),
    color: "#FFFFFF",
    textAlign: "center",
    display: "block",
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roles = [
    { value: 'ORGANIZATION', label: 'ORGANIZATION' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'SALES_MANAGER', label: 'SALES MANAGER' },
    { value: 'TECHNICIAN', label: 'TECHNICIAN' },
  ];

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://192.168.29.220:8080/api/auth/organize/authenticate?email=${email}&password=${password}&role=${formik.values.role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const { role } = result; 
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        if (role === "ORGANIZATION") {
          navigate("/OrganizationDashboard");
        } else if (role === "technician") {
          navigate("/TechnicianDashboard");
        } else {
          throw new Error("Invalid role. Please contact the administrator.");
        }
  
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: `Welcome, ${role}!`,
        });
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Failed to login. Please try again later.");
    }
  };

  const formik = useFormik({
    initialValues: {
      role: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.role) {
        errors.role = 'Role is required';
      }
      return errors;
    },
    onSubmit: (values) => {
      handleLogin();
    }
  });
  

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Typography variant="h4" align="center" style={{ color: "white" }}>
          Sign In
        </Typography>
        <div className={classes.form}>
          <label className={classes.label}>Email:</label>
          <TextField
            className={classes.textField}
            variant="filled"
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={classes.label}>Password:</label>
          <TextField
            className={classes.textField}
            variant="filled"
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={classes.label}>Role:</label>

          <FormControl
            fullWidth
            variant="filled"
            error={!!formik.errors.role}
            className={classes.formControl}
           style={{backgroundColor:'#f7fffe'}}
          >
           
            <Select
              value={formik.values.role}
              onChange={formik.handleChange}
              name="role"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return 'Select Role'; 
                }
                return roles.find((role) => role.value === selected)?.label;
              }}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
          </FormControl>

          <Button
            type="button"
            fullWidth
            variant="contained"
            className={classes.submit}
            onClick={formik.handleSubmit}
          >
            Sign In
          </Button>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          {/* <Link variant="body2" className={classes.link} onClick={() => navigate("/OrganizationForm")}>
            Not registered yet? Create an account
          </Link> */}

        <Typography align="center" style={{ color: "white", marginRight: '8px' }}>
          Not registered yet?
          <Link
            onClick={() => navigate("/OrganizationForm")}
            // className={classes.link}
            style={{ color: "#fff", fontWeight: "bold", cursor: "pointer" ,paddingLeft:'6px'}}
          >
            Create an account
          </Link>
        </Typography>
        




        </div>
      </Container>
    </div>
  );
};

export default SignIn;
