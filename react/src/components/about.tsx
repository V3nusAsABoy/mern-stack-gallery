import draw from '../img/draw.png';
import {useState} from 'react';

export default function about({about, admin, url, setDescription} : {about: string, admin: Boolean, url: string, setDescription: Function}){
    const [changeAbout, setChangeAbout] = useState(false);
    const [newAbout, setNewAbout] = useState("");

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewAbout(e.target.value);
    }

    async function newDesc(){
        const response = await fetch(`${url}description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({description: newAbout})
        });
        if(response.ok){
            response.json().then(data => {
                setDescription(data.description);
            });
        } else {
            response.json().then(error => {
                console.error('Error:', error);
            });
        }
    }

    return(<div id="about">
                <h1>about</h1>
                <hr/>
                {about && 
                <p>
                    {about}
                </p>
                }
                {!about && !changeAbout &&
                    <p style={{color: "gray"}}>No description provided.</p>
                }
                {!about && changeAbout &&
                <>
                    <textarea onChange={handleChange}></textarea>
                    <br/>
                    <button onClick={() => setChangeAbout(false)}>cancel</button>
                    <button onClick={newDesc}>submit</button>
                </>
                }
                {!about && admin && !changeAbout &&
                    <button onClick={() => setChangeAbout(true)}>Add description</button>
                }
                <div className="grid">
                    <img src={draw} alt="draw" style={{float:"right",width:"15em",gridColumn:"3"}}/>
                </div>
            </div>);
}