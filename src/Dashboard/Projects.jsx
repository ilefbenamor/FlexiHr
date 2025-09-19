import React from "react";
import "./Project.css";

function Projects({ projectList }) {
  return (
    <div className="project-summary">
      <h2>📋 Liste des Projets</h2>
      {projectList.length > 0 ? (
        <ul className="project-list">
          {projectList.map((project, index) => (
            <li key={index} className="project-item">
              <span className="project-name">📌 {project.name}</span>
              <span className="project-date">📅 {project.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun projet disponible pour le moment.</p>
      )}
    </div>
  );
}

export default Projects;
