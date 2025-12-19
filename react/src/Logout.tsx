import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Logout(){
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        fetch('http://localhost:4000/logout', {
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