import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type art from "./types/art";

export default function DrawingPage(){
    const {id} = useParams();
    const [drawing, setDrawing] = useState();
    const url: string = 'http://localhost:4000/';

    useEffect(() => {
        fetch(`${url}drawing/${id}`)
        .then(response => response.json())
        .then(data => setDrawing(data))
    },[]);
    return(
        <div className="body">
            {drawing &&
                <div className="drawingPageContainer">
                    <h1>{(drawing as art).title}</h1>
                    <h2>by {(drawing as art).artist}</h2>
                    <img src={`${url}${(drawing as art).art}`} alt={(drawing as art).title} />
                </div>
            }
        </div>
    )
}