import React from 'react';

const people = [
  { name: 'Anup Paikaray', roll: 1901106475 },
  { name: 'Gourav Adhikary', roll: 1901106494 },
  { name: 'Mannpreeti Toppo', roll: 1901106505 },
  { name: 'Pratiksha Kullu', roll: 1901106512 },
  { name: 'Pratyusha Sarangi', roll: 1901106513 },
  { name: 'Mentor', roll: 10000000000 },
];

function AboutUs() {
  return (
    <div>
      <h2>About Us</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '20px'}}>
        {people.map((person, index) => (
          <div key={index} style={{border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 2px rgba(0, 0, 0, 0.3)', padding: '20px', textAlign: 'center'}}>
            <img src={`assets/avatars/${person.roll}.png`} alt={person.name} style={{height: '100px', width: '100px'}}/>
            <h3>{person.name}</h3>
            <p>{person.roll}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
