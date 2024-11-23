import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState({ name: "", permissions: [] });

  const navigate = useNavigate();

  const fetchRoles = async () => {
    const response = await axios.get("https://rbac-backend-513o.onrender.com/roles");
    setRoles(response.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (editMode) {
      await axios.put(
        `https://rbac-backend-513o.onrender.com/roles/${currentRole._id}`,
        currentRole
      );
    } else {
      await axios.post("https://rbac-backend-513o.onrender.com/roles", currentRole);
    }

    fetchRoles();
    setShow(false);
    setCurrentRole({ name: "", permissions: [] });
  };

  const handleEdit = (role) => {
    setEditMode(true);
    setCurrentRole(role);
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://rbac-backend-513o.onrender.com/roles/${id}`);
    fetchRoles();
  };

  return (
    <div className="container mt-4">
      <h2>Role Management</h2>
      <Button
        variant="primary"
        className="me-2"
        onClick={() => {
          setEditMode(false);
          setCurrentRole({ name: "", permissions: [] });
          setShow(true);
        }}
      >
        Add Role
      </Button>
      <Button variant="secondary" onClick={() => navigate("/")}>
        Manage User
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(", ")}</td>
              <td>
                <Button
                  variant="success"
                  className="me-3"
                  onClick={() => handleEdit(role)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="ms-3"
                  onClick={() => handleDelete(role._id)}
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
          <Modal.Title>{editMode ? "Edit Role" : "Add Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="name">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role name"
                value={currentRole.name}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="permissions" className="mt-3">
              <Form.Label>Permissions</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter permissions (comma-separated)"
                value={currentRole.permissions.join(", ")}
                onChange={(e) =>
                  setCurrentRole({
                    ...currentRole,
                    permissions: e.target.value
                      .split(",")
                      .map((perm) => perm.trim()),
                  })
                }
                required
              />
            </Form.Group>
            <Button
              variant="secondary"
              className="mt-3 me-3"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
            <Button variant="primary" type="submit" className="mt-3">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoleManagement;
