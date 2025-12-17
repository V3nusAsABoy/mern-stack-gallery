import { useEffect, useState } from 'react'
import './App.css'
import Logos from './components/logos';
import Home from './components/home';
import About from './components/about';
import Artists from './components/artists';
import Navbar from './components/navbar';
import Drawings from './components/drawings';
import type Art from './types/art';
import { UserContext } from './UserContext';

function App() {

  const [home, setHome] = useState(true);
  const [about, setAbout] = useState(false);
  const [artists, setArtists] = useState(false);
  const [drawings, setDrawings] = useState(false);
  const [art, setArt] = useState<Art[] | null>(null);
  const [userInfo, setUserInfo] = useState<{}>(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/drawings')
      .then(response => response.json())
      .then(data => setArt(data))
      .catch(error => console.error('Error fetching art data:', error));
  }, []);

  useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

  return (
    <div className="body">
      <Logos />
      <Navbar setHome={setHome} setAbout = {setAbout} setArtists={setArtists} setDrawings={setDrawings}/>
      {home && <Home />}
      {about && <About />}
      {artists && <Artists />}
      {drawings && <Drawings drawings={art} />}
    </div>
  )
}

export default App
