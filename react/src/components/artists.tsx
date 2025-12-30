import {useState} from 'react';

export default function artists({admin} : {admin: Boolean}){
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