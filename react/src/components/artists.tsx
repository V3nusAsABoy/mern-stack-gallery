import {useState} from 'react';
import type Artist from '../types/artist';
import ArtistDesc from './artistDesc';

export default function artists({admin, artists} : {admin: Boolean, artists: Artist[]}){
    const [formData, setFormData] = useState({
            artist: "",
            description: "",
        });

     const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    return(
        <div id="artists">
            <h1>artists</h1>
            <hr/>
            {artists && artists.map((artist, index) => (
                <ArtistDesc key={index} name={artist.name} description={artist.description}/>
            ))}
            {artists.length === 0 &&
                <h2>No artists yet!</h2>
            }
            {admin && 
            <form className="register-form">
                <h2>Add new artist</h2>
                <label htmlFor="title">Artist:</label>
                <input type="text" id="artist" name="artist" value={formData.artist} onChange={handleChange}/>
                <br/>
                <label htmlFor="artist">Description:</label>
                <textarea style={{width: "80%", height: "20%"}} id="description" name="description" value={formData.description} onChange={handleChange}/>
                <br />
                <button type="submit">Submit</button>
            </form>
            }
        </div>
    );
}