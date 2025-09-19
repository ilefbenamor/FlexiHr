import React from 'react';
import './Services.css';

function Services() {
  const services = [
    {
      title: 'Gestion des congés',
      description: 'Simplifiez la gestion des congés avec notre outil intuitif.',
      icon: '📆',
    },
  
    {
      title: 'Gestion des utilisateurs',
      description: 'Attribuez des rôles et suivez les performances.',
      icon: '👥',
    },
    {
      title: 'Rapports analytiques',
      description: 'Générez des rapports détaillés pour des prises de décisions éclairées.',
      icon: '📊',
    },
  ];

  return (
    <div className="services" id="Services">
      <h2 className="services-title">Nos Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
