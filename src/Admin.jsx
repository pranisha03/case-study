import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from './AdminService';
import ProjectList from './ProjectList';

const Admin = () => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    owner: ''
  });

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    employeeId: '',
    taskStatus: 'PENDING',
    projectId: ''
  });

  const [projects, setProjects] = useState([]);
  const [tasksList, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false);
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    const adminService = new AdminService();
    try {
      const response = await adminService.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    const adminService = new AdminService();
    try {
      const response = await adminService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const adminService = new AdminService();
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value
    }));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const adminService = new AdminService();
    try {
      const projectData = {
        ...project,
        ownerId: parseInt(project.owner, 10)
      };

      if (isEditingProject) {
        await adminService.updateProject(editProjectId, projectData);
        alert('Project updated successfully');
        setIsEditingProject(false);
        setEditProjectId(null);
      } else {
        await adminService.createProject(projectData);
        alert('Project created successfully');
      }

      setProject({ title: '', description: '', startDate: '', endDate: '', owner: '' });
      fetchProjects();
      setOpenCreateProjectDialog(false);
    } catch (error) {
      console.error('Error creating/updating project:', error);
      alert('Failed to create/update project');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const adminService = new AdminService();
    try {
      if (isEditingTask) {
        await adminService.updateTask(editTaskId, task);
        alert('Task updated successfully');
        setIsEditingTask(false);
        setEditTaskId(null);
      } else {
        await adminService.createTask(task);
        alert('Task created successfully');
      }

      setTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'LOW',
        employeeId: '',
        taskStatus: 'PENDING',
        projectId: ''
      });
      fetchTasks();
      setOpenCreateTaskDialog(false);
    } catch (error) {
      console.error('Error creating/updating task:', error);
      alert('Failed to create/update task');
    }
  };

  const handleDeleteProject = async (projectId) => {
    const adminService = new AdminService();
    try {
      await adminService.deleteProject(projectId);
      alert('Project deleted successfully');
      fetchProjects();
      fetchTasks();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const adminService = new AdminService();
    try {
      await adminService.deleteTask(taskId);
      alert('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    const formattedDueDate = task.dueDate.split('T')[0];
    setTask({
      title: task.title,
      description: task.description,
      dueDate: formattedDueDate,
      priority: task.priority,
      employeeId: task.employeeId,
      taskStatus: task.taskStatus,
      projectId: task.projectId
    });
    setIsEditingTask(true);
    setEditTaskId(task.id);
    setOpenCreateTaskDialog(true);
  };

  const handleEditProject = (project) => {
    const formattedStartDate = project.startDate.split('T')[0];
    const formattedEndDate = project.endDate.split('T')[0];
    setProject({
      title: project.title,
      description: project.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      owner: project.ownerId
    });
    setIsEditingProject(true);
    setEditProjectId(project.id);
    setOpenCreateProjectDialog(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const adminService = new AdminService();
    try {
      const response = await adminService.searchTasks(searchTerm);
      setTasks(response.data);
      setIsSearching(true);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowAllTasks = () => {
    setSearchTerm('');
    fetchTasks();
    setIsSearching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    console.log('User logged out');
  };

  return (
    <div>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ paddingTop: 1 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateProjectDialog(true)}
              style={{ marginBottom: 16 }}
            >
              Create a New Project
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateTaskDialog(true)}
              style={{ marginBottom: 16, marginLeft: 16 }}
            >
              Create a New Task
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: 20 }}>
              <Typography variant="h6" gutterBottom>
                Task List
              </Typography>
              <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
                <TextField
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search tasks..."
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: 16 }}>
                  Search
                </Button>
                {isSearching && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleShowAllTasks}
                    style={{ marginTop: 16, marginLeft: 16 }}
                  >
                    Show All Tasks
                  </Button>
                )}
              </form>
              {loading ? (
                <CircularProgress />
              ) : (
                <ProjectList
                  projects={projects}
                  onEditProject={handleEditProject}
                  onDeleteProject={handleDeleteProject}
                  tasks={tasksList}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  users={users}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openCreateProjectDialog}
        onClose={() => setOpenCreateProjectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditingProject ? 'Edit Project' : 'Create a New Project'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleProjectSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                name="title"
                label="Project Title"
                value={project.title}
                onChange={handleProjectChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="description"
                label="Project Description"
                value={project.description}
                onChange={handleProjectChange}
                required
                multiline
                rows={4}
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    value={project.startDate}
                    onChange={handleProjectChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="endDate"
                    label="End Date"
                    type="date"
                    value={project.endDate}
                    onChange={handleProjectChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel id="project-owner-label">Project Owner</InputLabel>
              <Select
                labelId="project-owner-label"
                name="owner"
                value={project.owner}
                label="Project Owner"
                onChange={handleProjectChange}
                required
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateProjectDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleProjectSubmit} color="primary">
            {isEditingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateTaskDialog}
        onClose={() => setOpenCreateTaskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditingTask ? 'Edit Task' : 'Create a New Task'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleTaskSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                name="title"
                label="Task Title"
                value={task.title}
                onChange={handleTaskChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="description"
                label="Task Description"
                value={task.description}
                onChange={handleTaskChange}
                required
                multiline
                rows={4}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="dueDate"
                label="Due Date"
                type="date"
                value={task.dueDate}
                onChange={handleTaskChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="priority-select-label">Priority</InputLabel>
                  <Select
                    labelId="priority-select-label"
                    id="priority-select"
                    name="priority"
                    value={task.priority}
                    label="Priority"
                    onChange={handleTaskChange}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="task-employee-label">Assign to Employee</InputLabel>
                  <Select
                    labelId="task-employee-label"
                    name="employeeId"
                    value={task.employeeId}
                    label="Assign to Employee"
                    onChange={handleTaskChange}
                    required
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="task-status-label">Task Status</InputLabel>
                  <Select
                    labelId="task-status-label"
                    name="taskStatus"
                    value={task.taskStatus}
                    label="Task Status"
                    onChange={handleTaskChange}
                    required
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="INPROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="task-project-label">Select Project</InputLabel>
                  <Select
                    labelId="task-project-label"
                    name="projectId"
                    value={task.projectId}
                    label="Select Project"
                    onChange={handleTaskChange}
                    required
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {projects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateTaskDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTaskSubmit} color="primary">
            {isEditingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
