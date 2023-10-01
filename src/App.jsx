import React, { useState, useEffect } from 'react';
import MD5 from 'crypto-js/md5';
import './App.css';

const API_PUBLIC_KEY = import.meta.env.VITE_REACT_APP_PUBLIC_KEY;
const API_PRIVATE_KEY = import.meta.env.VITE_REACT_APP_PRIVATE_KEY;
const API_BASE_URL = 'https://gateway.marvel.com/v1/public';
const COMICS_ENDPOINT = `${API_BASE_URL}/characters`;


function generateHash(ts) {
  const hash = MD5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY);
  return hash;
}

function App() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const ts = new Date().getTime().toString();
    const hash = generateHash(ts);

    
    fetch(`${COMICS_ENDPOINT}?apikey=${API_PUBLIC_KEY}&ts=${ts}&hash=${hash}`)
      .then(response => response.json())
      .then(data => {
        setComics(data.data.results);

      })
      .catch(error => {
        console.error('Error fetching comics:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Lista de Personajes de Marvel</h1>
      <ul className="characters-list">
        {comics.map(character => (
          <li key={character.id} className="character-item">
            <h2>{character.name}</h2>
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className="character-image"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;