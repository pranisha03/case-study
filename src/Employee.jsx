import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import EmployeeService from './EmployeeService';

const EmployeePage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [completedMessage, setCompletedMessage] = useState('');
  const employeeService = new EmployeeService();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await employeeService.getEmployeeTasksById();
      console.log('Tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await employeeService.getEmployeeProjects();
      console.log('Projects:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await employeeService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
      setCompletedMessage(`Task ${taskId} has been marked as completed.`);
      setTimeout(() => {
        setCompletedMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/login');
    console.log('User logged out');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Page
        </Typography>
        <Box my={3}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Projects
          </Typography>
          {projects.length === 0 ? (
            <Typography variant="body1">No projects assigned.</Typography>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    sx={{
                      backgroundColor: '#e3f2fd',
                      border: '2px solid #1e88e5', 
                      borderRadius: 2, 
                      boxShadow: 3, 
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box my={3}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Tasks
          </Typography>
          {completedMessage && <Alert severity="success">{completedMessage}</Alert>}
          {tasks.length === 0 ? (
            <Typography variant="body1">No tasks assigned.</Typography>
          ) : (
            <Grid container spacing={3}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <Card
                    sx={{
                      backgroundColor: '#e8f5e9',
                      border: '2px solid #43a047', 
                      borderRadius: 2, 
                      boxShadow: 3, 
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.status}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                      >
                        Mark as Completed
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeePage;
