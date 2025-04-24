
const menuItems = {
  'Cursos': [
    { label: 'Crear curso', path: '/NewCourse', restrictedTo: 'professor' },
    { label: 'Ver cursos', path: '/See_Courses' },
  ],
  'Mis Cursos': [
    { label: 'Cursos matriculados', path: '/my-courses/enrolled' },
    { label: 'Matricular cursos', path: '/my-courses/enroll' },
  ],
  'Amigos': [
    { label: 'Buscar usuario', path: '/friends/search' },
    { label: 'Ver amigos', path: '/friends/list' },
  ],
  'Evaluaciones': [
    { label: 'Ver Evaluaciones', path: '/evaluations' }
  ],
  'Perfil': [
    { label: 'Editar perfil', path: '/profile/edit' },
    { label: 'Cerrar sesión', path: 'logout' },
  ],
};

export default menuItems;