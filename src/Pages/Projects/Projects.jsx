import React, { useEffect } from 'react';
import './Projects.css';
import Text_Projects from './Text_Projects';
import Slider from './Slider';

const Projects = () => {

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <div className='Projects container'>
        <div className="reveal reveal-delay-1">
    <Text_Projects />
  </div>
       <div className="reveal reveal-delay-2">
    <Slider />
  </div>
    </div>
  );
}

export default Projects;
