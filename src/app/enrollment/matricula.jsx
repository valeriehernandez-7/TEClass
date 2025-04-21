import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../shared/Form.css';

export default function Matricula() {
  const [cursos, setCursos] = useState([]);
  const [matriculados, setMatriculados] = useState([]);
  const userId = 'efcfe460-a2b6-11ee-b9d1-0242ac120002'; // luego dinámico

  useEffect(() => {
    axios.get('http://localhost:3001/cursos')
      .then(res => setCursos(res.data))
      .catch(err => console.error('Error al obtener cursos:', err));

    axios.get(`http://localhost:3001/matriculas/${userId}`)
      .then(res => setMatriculados(res.data))
      .catch(err => console.error('Error al obtener matrículas:', err));
  }, []);

  const handleMatricular = (courseId) => {
    axios.post('http://localhost:3001/matricular', { userId, courseId })
      .then(() => {
        alert('¡Matriculado correctamente!');
        axios.get(`http://localhost:3001/matriculas/${userId}`)
          .then(res => setMatriculados(res.data));
      })
      .catch(err => alert('Error al matricular'));
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-header">
          <h2 className="text">Cursos Disponibles</h2>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          {cursos.length === 0 ? (
            <p style={{ color: 'white' }}>No hay cursos disponibles en este momento.</p>
          ) : (
            cursos.map(curso => {
              const yaMatriculado = matriculados.some(m => m.course_id === curso.course_id);
              return (
                <div key={curso.course_id} className="input" style={{ justifyContent: 'space-between', padding: '0 20px' }}>
                  <span className={yaMatriculado ? "matriculado" : ""}>{curso.title}</span>
                  <span>{new Date(curso.start_date).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleMatricular(curso.course_id)}
                    disabled={yaMatriculado}
                    className={`register-button ${yaMatriculado ? "boton-desactivado" : ""}`}
                    style={{ width: '150px', height: '40px' }}
                  >
                    {yaMatriculado ? "Ya Matriculado" : "Matricular"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="register-header" style={{ marginTop: '40px' }}>
          <h2 className="text">Mis Cursos Matriculados</h2>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          {matriculados.length === 0 ? (
            <p style={{ color: 'white' }}>Aún no estás matriculado en ningún curso.</p>
          ) : (
            matriculados.map(m => (
              <div key={m.course_id} className="input" style={{ justifyContent: 'center' }}>
                <span>ID: {m.course_id}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}