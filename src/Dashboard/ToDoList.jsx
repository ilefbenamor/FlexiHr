import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./taches.css";

function ToDoList() {
    const [tasks, setTasks] = useState([
        "Planifier la réunion du projet",
        "Vérifier les demandes des utilisateurs",
    ]);
    const [newTask, setNewTask] = useState("");
    const navigate = useNavigate();

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            setTasks((t) => [...t, newTask]);
            setNewTask("");
        }
    }

    function deleteTask(index) {
        setTasks(tasks.filter((_, i) => i !== index));
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [
                updatedTasks[index - 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [
                updatedTasks[index + 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);
        }
    }

    return (
        <Container fluid className="todo-container">
            {/* En-tête avec titre et bouton retour */}
            <Row className="header">
                <Col xs={8}>
                    <h1 className="text-primary">📝 Mes Tâches</h1>
                </Col>
                <Col xs={4} className="text-end">
                    <Button variant="outline-primary" onClick={() => navigate(-1)}>
                        ← Retour
                    </Button>
                </Col>
            </Row>

            {/* Formulaire d'ajout */}
            <Row className="justify-content-center task-input-container">
                <Col md={6} className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Ajouter une tâche..."
                        value={newTask}
                        onChange={handleInputChange}
                        className="task-input"
                    />
                    <Button variant="primary" onClick={addTask} className="add-button">
                        + Ajouter
                    </Button>
                </Col>
            </Row>

            {/* Liste des tâches bien encadrée */}
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="task-list-container">
                        <Table striped bordered hover className="task-table">
                            <thead>
                                <tr>
                                    <th className="text-center">Tâche</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteTask(index)}
                                                className="me-2"
                                            >
                                                <FaTrash />
                                            </Button>
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => moveTaskUp(index)}
                                                className="me-1"
                                            >
                                                <FaArrowUp />
                                            </Button>
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => moveTaskDown(index)}
                                            >
                                                <FaArrowDown />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ToDoList;
