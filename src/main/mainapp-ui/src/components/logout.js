import React, {useState} from 'react';

export const Logout = () => {

   const [state, setState] = useState({username: "", password: "", email: ""});

    const handleChange = (event) => {
        setState(prevState => ({...prevState, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        alert('A username and password was submitted: ' + state.username + " " + state.password + " " + state.email);
        event.preventDefault();
    }

    return (
         <div>
                Signup
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input name="username" type="text" value={state.username} onChange={handleChange}/>
                    </label>
                    <label>
                        Email:
                        <input name="email" type="email" value={state.email} onChange={handleChange}/>
                    </label>
                    <label>
                        Password:
                        <input name="password" type="password" value={state.password} onChange={handleChange}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
}
