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
      const searchedTasks = response.data;

      if (searchedTasks.length > 0) {
        const taskProjectIds = searchedTasks.map(task => task.projectId);
        const filteredProjects = projects.filter(project => taskProjectIds.includes(project.id));

        setProjects(filteredProjects);
        setTasks(searchedTasks);
        setIsSearching(true);
      } else {
        alert('No tasks found');
      }
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowAllTasks = () => {
    setSearchTerm('');
    fetchProjects();
    fetchTasks();
    setIsSearching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    console.log('User logged out');
  };

  const handleHome = () => {
    localStorage.removeItem('authToken');
    navigate('/home');
    console.log('User led to home page');
  };

  return (
    <div>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleHome}>
            Home
          </Button>
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
                    variant="contained"
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
                  tasks={tasksList}
                  users={users}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onEditProject={handleEditProject}
                  onDeleteProject={handleDeleteProject}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openCreateProjectDialog} onClose={() => setOpenCreateProjectDialog(false)}>
        <DialogTitle>{isEditingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleProjectSubmit}>
            <TextField
              name="title"
              label="Title"
              value={project.title}
              onChange={handleProjectChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="description"
              label="Description"
              value={project.description}
              onChange={handleProjectChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={project.startDate}
              onChange={handleProjectChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={project.endDate}
              onChange={handleProjectChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Owner</InputLabel>
              <Select
                name="owner"
                value={project.owner}
                label="Owner"
                onChange={handleProjectChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={() => setOpenCreateProjectDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isEditingProject ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openCreateTaskDialog} onClose={() => setOpenCreateTaskDialog(false)}>
        <DialogTitle>{isEditingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleTaskSubmit}>
            <TextField
              name="title"
              label="Title"
              value={task.title}
              onChange={handleTaskChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="description"
              label="Description"
              value={task.description}
              onChange={handleTaskChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={task.dueDate}
              onChange={handleTaskChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={task.priority}
                label="Priority"
                onChange={handleTaskChange}
              >
                <MenuItem value="LOW">LOW</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="HIGH">HIGH</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Employee</InputLabel>
              <Select
                name="employeeId"
                value={task.employeeId}
                label="Employee"
                onChange={handleTaskChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="taskStatus"
                value={task.taskStatus}
                label="Status"
                onChange={handleTaskChange}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={task.projectId}
                label="Project"
                onChange={handleTaskChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={() => setOpenCreateTaskDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isEditingTask ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;