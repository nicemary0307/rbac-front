

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    roles: [],
    status: "Active",
  });

  const navigate = useNavigate();
 
  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (editMode) {
      
      await axios.put(
        `http://localhost:5000/users/${currentUser._id}`,
        currentUser
      );
    } else {
      
      await axios.post("http://localhost:5000/users", currentUser);
    }

    fetchUsers();
    setShow(false);
    setCurrentUser({ name: "", email: "", roles: [], status: "Active" });
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setCurrentUser(user);
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Button
        variant="primary"
        className="me-2"
        onClick={() => {
          setEditMode(false);
          setCurrentUser({ name: "", email: "", roles: [], status: "Active" });
          setShow(true);
        }}
      >
        Add User
      </Button>
      <Button variant="secondary" onClick={() => navigate("/roles")}>
        Manage Roles
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>{user.status}</td>
              <td>
                <Button
                  variant="success"
                  className="me-3"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-3"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                required
              />
            </Form.Group>
            

            <Form.Group className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.roles}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, roles: e.target.value })
                }
              >
                <option>Admin</option>
                <option>Editor</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="status" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentUser.status}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="secondary"
              className="mt-3 me-3"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
            <Button variant="success" type="submit" className="mt-3">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
