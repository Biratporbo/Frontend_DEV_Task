import React from 'react';

const Skills = () => {
  const skillsArray = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git', 'Responsive Design'];

  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skills-list">
        {skillsArray.map((skill, index) => (
          <span key={index} className="skill-item">{skill}</span>
        ))}
      </div>
    </section>
  );
};

export default Skills;