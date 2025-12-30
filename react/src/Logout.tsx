import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Logout(){
    const url: string = 'https://localhost:4000/';
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        fetch(`${url}logout`, {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            setRedirect(true);
        });
    }, []);
    if (redirect) {
        return <Navigate to="/" />;
    }
}