import {useState, type SetStateAction} from 'react';
import type Art from '../types/art';
import Drawing from './drawing';

export default function drawings({drawings, admin, setDrawings} : {drawings: Art[], admin: boolean, setDrawings: Function}) {
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
    });
    const [files, setFiles] = useState<File | null>(null);
    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    async function newDrawing(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const data = new FormData();
        data.set('title', formData.title);
        data.set('artist', formData.artist);
        data.set('file', files as Blob);
        const response = await fetch('http://localhost:4000/drawing', {
            method: 'POST',
            body: data,
    });
    if(response.ok){
        response.json().then(data => {
            setDrawings((prevDrawings: Art[]) => [...prevDrawings, data]);
        });
    } else {
        response.json().then(error => {
            console.error('Error:', error);
        });
    }
    }
    return(
        <div id = "gallery">
            <h1>gallery</h1>
            {drawings && drawings.map((artwork, index) => (
                <Drawing key={index} title={artwork.title} artist={artwork.artist} drawing={artwork.art} setDrawings={setDrawings} admin={admin} id={artwork._id} />
            ))}
            {admin &&
            <form onSubmit={newDrawing} className="register-form" style={{marginTop:"1em"}}>
                <h2>Add New Drawing</h2>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}/>
                <br/>
                <label htmlFor="artist">Artist:</label>
                <input type="text" id="artist" name="artist" value={formData.artist} onChange={handleChange}/>
                <br/>
                <label htmlFor="drawing">Drawing:</label>
                <input type="file" name = "drawing" onChange = {e => setFiles(e.target.files?.[0] || null)}/>
                <br />
                <button type="submit">Submit</button>
            </form>}
        </div>
    );
}