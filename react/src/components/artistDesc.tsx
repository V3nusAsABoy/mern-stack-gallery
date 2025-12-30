export default function artistDesc({name, description} : {name: string, description: string}){
    return(
        <div>
            <h2>{name}</h2>
            <p>{description}</p>
        </div>
    )
}