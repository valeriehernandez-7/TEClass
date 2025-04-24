const express = require('express');
const router = express.Router();
const { getUserById, 
        getUserByUsername, 
        registerUser,
        validateUser,
        updateUser,
        getAllUsers,
        NewCourse,
        getAllCourses,
        getCourseById,
        insertSection,
        getCursosCreados,
        getCursosMatriculados,
        getEstudiantesDelCurso,
        getCoursesbyId,
        getCourseByCode
} = require('./m_functions');

/* 
In this file, all the routes for every mongo function are made.
A route is needed beacuse the functions are not directly accessible from the client side.
The routes are made using express, and the functions are imported from m_functions.js.
This routes will be used in the server.js file to create the API.
*/

router.get('/by-username/:username', async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/by-id/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register user');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await validateUser(username, password);
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const newData = req.body;
    try {
        const updatedUser = await updateUser(newData, userId);
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update user');
    }
});

router.get('/all-users', async (req, res) => {
    const { currentUserId } = req.query;
  
    if (!currentUserId) {
        return res.status(400).json({ success: false, message: 'Missing current user ID' });
    }
  
    try {
        const users = await getAllUsers(currentUserId);
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'Users not found' });
        }
        res.json(users);
    } catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


//Course routes

router.post('/NewCourse', async (req, res) => {
    try {
        const result = await NewCourse(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add course');
    }
});

router.get('/getAllCourses', async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.status(200).json(courses);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch courses');
    }       
});

router.get('/getCourseById/:id', async (req, res) => {
    try {
        const course = await getCourseById(req.params.id);
        if (!course) return res.status(404).send('Course not found');
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.put('/InsertSection', async (req, res) => {
    try {
        const result = await insertSection(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add section');
    }
});

// Obtener cursos creados por un usuario
router.get('/getCodigosCursosCreados/:id', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    try {
        const cursos = await getCursosCreados(userId);
        res.status(200).json(cursos);
    } catch (err) {
        console.error('Error en /getCodigosCursosCreados:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Obtener cursos en los que un usuario está matriculado
router.get('/getCodigosCursosMatriculados/:id', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    try {
        const cursos = await getCursosMatriculados(userId);
        res.status(200).json(cursos);
    } catch (err) {
        console.error('Error en /getCodigosCursosMatriculados:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Obtener estudiantes matriculados en un curso
router.get('/getIdsEstudiantesMatriculados/:id', async (req, res) => {
    const codigo = req.query.codigo;
    if (!codigo) return res.status(400).json({ error: 'Missing course code' });

    try {
        const estudiantes = await getEstudiantesDelCurso(codigo);
        res.status(200).json(estudiantes);
    } catch (err) {
        console.error('Error en /getIdsEstudiantesMatriculados:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getCoursesByIds/:ids', async (req, res) => {
    const ids = req.params.ids.split(','); // ['id1', 'id2', 'id3'] // Check both params and query for ids
    console.log('courseIds:', ids); // Log the courseIds to check if they are being received correctly
    if (!ids) {
        return res.status(400).json({ success: false, message: 'Missing course IDs' });
    }
  
    try {
        const courses = await getCoursesbyId(ids);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Courses not found' });
        }
        res.json(courses);
    } catch (err) {
        console.error('Error getting courses:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}); 

router.get('/getCourseByCode/:code', async (req, res) => {
    const courseCode = req.params.code; // Check both params and query for courseCode
    if (!courseCode) {
        return res.status(400).json({ success: false, message: 'Missing course code' });
    }

    try {
        const course = await getCourseByCode(courseCode);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error('Error getting course:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
