import draw from '../img/draw.png';

export default function about(){
    return(<div id="about">
                <h1>about</h1>
                <hr/>
                <p>
                    TheArtZone is a Canadian based art gallery proudly established on February 19, 2025. Created by three talented and passionate 
                    individuals. At ArtZone, our mission is to create and showcase diverse art work that resonates with emotions, provides rich 
                    storytelling, and enables artistic expression. The ArtZone aims to connect people through the power of creativity, when they 
                    are artists themselves or if they are art enthusiasts.

                </p>
                <div className="grid">
                    <img src={draw} alt="draw" style={{float:"right",width:"15em",gridColumn:"3"}}/>
                </div>
            </div>);
}