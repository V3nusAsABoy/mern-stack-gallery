import pallette from '../img/pallette.png';

export default function logos(){
    return(
    <div id="logos">
        <img style={{width:"7em",margin:"2em",gridColumn:"3"}} src={pallette} alt="logo"/>
        <h1 style = {{float:"right",fontSize:"300%",gridColumn:"5"}}>TheArtZone</h1>
    </div>);
}