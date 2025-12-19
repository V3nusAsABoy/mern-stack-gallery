import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {UserContextProvider} from './UserContext.tsx';
import App from './App.tsx';
import Register from './Register.tsx';
import Login from './Login.tsx';
import Logout from './Logout.tsx';

export default function index(){
    return(
        <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
    )
}