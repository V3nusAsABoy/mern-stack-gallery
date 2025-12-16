export default function navbar({setHome, setAbout, setArtists}:{setHome:Function, setAbout:Function, setArtists:Function}){
    function home(){
        setHome(true);
        setAbout(false);
        setArtists(false);
    }
    function about(){
        setHome(false);
        setAbout(true);
        setArtists(false);
    }
    function artists(){
        setHome(false);
        setAbout(false);
        setArtists(true);
    }
    return(
    <nav className="navbar">
                <div><button id="homeButton" onClick={home}>Home</button></div>
                <div><button id="aboutButton" onClick={about}>About</button></div>
                <div><button id="artistsButton" onClick={artists}>Artists</button></div>
            </nav>
    );
}