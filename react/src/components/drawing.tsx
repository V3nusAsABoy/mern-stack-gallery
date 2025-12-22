import type Art from "../types/art";

export default function drawing({title, artist, drawing, setDrawings, admin, id} : {title: string, artist: string, drawing: string, setDrawings: Function, admin: boolean, id: string}) {
    
    async function deleteDrawing(){
        const response = await fetch(`http://localhost:4000/drawing/${id}`, {
            method: 'DELETE',
    });
        if(response.ok){
            setDrawings((prevDrawings: Art[]) => prevDrawings.filter(art => art._id !== id));
        }
    }

    return(
        <>
            <hr />
            <h1>{title}</h1>
            <img src={`http://localhost:4000/${drawing}`} alt={title} />
            <p>By {artist}</p>
            {admin && <button onClick={deleteDrawing}>delete</button>}
        </>
    )
}