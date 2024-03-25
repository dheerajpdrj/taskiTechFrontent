import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { userHeadings } from "../../utils/dummyData";
import dayjs from "dayjs";
import ConfirmationModal from "../modal/ConfirmationModal";

const Details = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/get_users`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(id ? `/adduser/${id}` : "/");
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${apiUrl}/api/delete_user/${userId}`);
      const response = await axios.get(`${apiUrl}/api/get_users`);
      setData(response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    setUserId(id);
    setModalOpen(true);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ p: 2 }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          User Details
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Link to="/adduser" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Add User
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#d6d6d6" }}>
              <TableRow>
                {userHeadings.map((heading) => (
                  <TableCell key={heading}>{heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <React.Fragment key={item._id}>
                  <TableRow>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.mobile}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>
                      {dayjs(item.dob).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(item.doj).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(item._id)}
                        variant="outlined"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(item._id)}
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {modalOpen && (
          <ConfirmationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={deleteUser}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Details;
