import React from 'react';

const people = [
  { first_name: 'Anup', last_name: 'Paikaray', roll: 1901106475 },
  { first_name: 'Gourav', last_name: 'Adhikary', roll: 1901106494 },
  { first_name: 'Mannpreeti', last_name: 'Toppo', roll: 1901106505 },
  { first_name: 'Pratiksha', last_name: 'Kullu', roll: 1901106512 },
  { first_name: 'Pratyusha', last_name: 'Sarangi', roll: 1901106513 },
  { first_name: 'Karmila', last_name: 'Soren', roll: '' },
];

function AboutUs() {
  return (
    <div>
      <h2>About Us</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '20px'}}>
        {people.map((person, index) => (
          <div key={index} style={{border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 2px rgba(0, 0, 0, 0.3)', padding: '20px', textAlign: 'center'}}>
            <img src={`assets/avatars/${person.first_name}.jpg`} alt={person.name} style={{height: '100px', width: '100px', borderRadius: '50%', overflow: 'hidden', marginBottom: '3vh'}}
                 onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src="assets/user.png"; }}/>
            <h3>{person.first_name + ' ' + person.last_name}</h3>
            <p>{person.roll}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
