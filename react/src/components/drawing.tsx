export default function drawing({title, artist, drawing} : {title: string, artist: string, drawing: string}) {
    return(
        <>
            <hr />
            <h1>{title}</h1>
            <img src={`http://localhost:4000/${drawing}`} alt={title} />
            <p>By {artist}</p>
        </>
    )
}