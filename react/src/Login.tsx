import './App.css';
import {useState} from 'react';
import {Navigate} from 'react-router-dom';

export default function Login(){
    const url: String = 'http://localhost:4000/';
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        invaliduser: false,
        invalidpassword: false
    });

    const [redirect, setRedirect] = useState(false);

    async function handleChange(e:React.FormEvent<HTMLInputElement>){
        e.preventDefault();
        const [name, value] = [(e.target as HTMLInputElement).name, (e.target as HTMLInputElement).value];
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setErrors({
            username: false,
            password: false,
            invaliduser: false,
            invalidpassword: false
        });
        if(!formData.username){
            setErrors(prevErrors => ({
                ...prevErrors,
                username: true
            }));
        }
        if(!formData.password){
            setErrors(prevErrors => ({
                ...prevErrors,
                password: true
            }));
        }
        if(Object.values(errors).every(error => error === false)){
            const data = new FormData();
            data.set('username', formData.username);
            data.set('password', formData.password);
            const response = await fetch(`${url}login`, {
                method: 'POST',
                body: JSON.stringify({username: formData.username, password: formData.password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if(response.status === 404){
                setErrors(prevErrors => ({
                    ...prevErrors,
                    invaliduser: true
                }));
            } else if(response.status === 401){
                setErrors(prevErrors => ({
                    ...prevErrors,
                    invalidpassword: true
                }));
            } else if (response.ok){
                response.json().then(() => {
                    setRedirect(true);
                });
            }
        }
    }
    if(redirect){
        return <Navigate to="/" />
    }
    return(
        <div className = "body login-reg">
            <div>
                <h1>Log in</h1>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                    <span className={errors.username ? "" : "hidden"}>Enter username</span>
                    <span className={errors.invaliduser ? "" : "hidden"}>Invalid username</span>
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    <span className={errors.password ? "" : "hidden"}>Enter password</span>
                    <span className={errors.invalidpassword ? "" : "hidden"}>Invalid password</span>
                    <br />
                    <button type="submit">Log in</button>
                </form>
            </div>
        </div>
    )
}