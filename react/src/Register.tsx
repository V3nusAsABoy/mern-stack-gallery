import './App.css';
import {useState} from 'react';
import {Navigate} from 'react-router-dom';

export default function Register(){
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        confirmPassword: false,
        takenUsername: false,
        passwordMismatch: false
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
        if(!formData.passwordConfirm){
            setErrors(prevErrors => ({
                ...prevErrors,
                confirmPassword: true
            }));
        }
        if(formData.password !== formData.passwordConfirm){
            setErrors(prevErrors => ({
                ...prevErrors,
                passwordMismatch: true
            }));
        }
        if(Object.values(errors).every(error => error === false)){
            const data = new FormData();
            data.set('username', formData.username);
            data.set('password', formData.password);
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({username: formData.username, password: formData.password}),
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if(response.status === 409){
                setErrors(prevErrors => ({
                    ...prevErrors,
                    takenUsername: true
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
        <div className = "body">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                <span className={errors.username ? "" : "hidden"}>Enter username</span>
                <span className={errors.takenUsername ? "" : "hidden"}>Username taken</span>
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                <span className={errors.password ? "" : "hidden"}>Enter password</span>
                <br />
                <label htmlFor="passwordConfirm">Confirm Password:</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} />
                 <span className={errors.confirmPassword ? "" : "hidden"}>Enter password again</span>
                 <span className={errors.passwordMismatch ? "" : "hidden"}>Passwords do not match</span>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}