export default function loginoptions ({username} : {username: Boolean}) {
    return(
        <>
            <div id="login-options">
            {username && <a href="/logout"><button>Logout</button></a>}
            {!username && 
                <>
                <a href="/login"><button>Login</button></a>
                <a href="/register"><button>Register</button></a>
                </>
            }
            </div>
        </>
    )
}