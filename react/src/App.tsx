import { useEffect, useState } from 'react'
import './App.css'
import Logos from './components/logos';
import Home from './components/home';
import About from './components/about';
import Artists from './components/artists';
import Navbar from './components/navbar';
import Drawings from './components/drawings';
import type Art from './types/art';
import Loginoptions from './components/loginoptions';
import type user from './types/user';
import Sidebar from './components/sidebar';

function App() {

  const [home, setHome] = useState(true);
  const [about, setAbout] = useState(false);
  const [artists, setArtists] = useState(false);
  const [drawings, setDrawings] = useState(false);
  const [art, setArt] = useState<Art[]>([]);
  const [userInfo, setUserInfo] = useState<user>({} as user);
  const [admin, setAdmin] = useState(false);
  const url: string = 'http://localhost:4000/';

  useEffect(() => {
    fetch(`${url}drawings`)
      .then(response => response.json())
      .then(data => setArt(data))
      .catch(error => console.error('Error fetching art data:', error));
  }, []);

  useEffect(() => {
        fetch(`${url}profile`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                checkAdmin();
            });
        });
    }, []);
  
    async function checkAdmin(){
        const response =  await fetch(`${url}admin`, {
            credentials: 'include',
        });
        if(response.ok){
            setAdmin(true);
        }
    }

  return (
    <>
    {drawings && <Sidebar drawings={art} />}
      <div className={`body ${drawings ? 'forTheGallery' : ''}`}>
        <Loginoptions username={userInfo.username} />
        <Logos />
        <Navbar setHome={setHome} setAbout = {setAbout} setArtists={setArtists} setDrawings={setDrawings}/>
        {home && <Home />}
        {about && <About />}
        {artists && <Artists />}
        {drawings && <Drawings drawings={art} admin={admin} setDrawings={setArt} url={url} />}
      </div>
    </>
  )
}

export default App
