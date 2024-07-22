import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US'); 
};

const ProjectList = ({ projects, onEditProject, onDeleteProject, tasks, onEditTask, onDeleteTask, users, loading }) => {
  const getTasksForProject = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getUserById = (id) => {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'Unknown';
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom sx={{ color: 'primary.main', fontSize: '1.5rem' }}>
                {project.title}
              </Typography>
              <Typography variant="h6" color="textSecondary" paragraph sx={{ color: 'text.primary', fontSize: '1.2rem' }}>
                {project.description}
              </Typography>
              <Divider />
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: 'text.primary', fontSize: '1rem' }}>
                Start Date: {formatDate(project.startDate)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: 'text.primary', fontSize: '1rem' }}>
                End Date: {formatDate(project.endDate)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: 'text.primary', fontSize: '1rem' }}>
                Assigned To:
                <Chip
                  label={project.ownerName}
                  avatar={<Avatar sx={{ bgcolor: deepOrange[500] }}>{project.ownerName[0]}</Avatar>}
                  sx={{ ml: 1 }}
                />
              </Typography>

              <Typography variant="h6" component="div" sx={{ mt: 2, color: 'primary.main', fontSize: '1.2rem' }}>
                Tasks
              </Typography>
              {getTasksForProject(project.id).length > 0 ? (
                getTasksForProject(project.id).map(task => (
                  <Card key={task.id} variant="outlined" sx={{ mt: 1 }}>
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ color: 'text.primary', fontSize: '1.3rem' }}>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                        {task.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                        Due Date: {formatDate(task.dueDate)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                        Priority:
                        <Chip
                          label={task.priority}
                          color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                        Assigned To: {getUserById(task.employeeId)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                        Status:
                        <Chip
                          label={task.taskStatus}
                          color={task.taskStatus === 'COMPLETED' ? 'success' : task.taskStatus === 'INPROGRESS' ? 'warning' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" color="primary" onClick={() => onEditTask(task)}>Edit</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => onDeleteTask(task.id)}>Delete</Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography>No tasks for this project</Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" color="primary" onClick={() => onEditProject(project)}>Edit Project</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => onDeleteProject(project.id)}>Delete Project</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;
