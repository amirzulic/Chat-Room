import React from "react";
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";

function Navbar() {
    let navigate = useNavigate();

    function handleLogOut() {
        if(localStorage.getItem("Authorization") !== null) {
            localStorage.removeItem("Authorization");
            navigate("/login");
        }
    }

    return(
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand text-primary" href="/"><b>CHATROOM</b></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {localStorage.getItem("Authorization") !== null ?
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li> : null }
                        {localStorage.getItem("Authorization") === null ?
                        <li className="nav-item">
                            <a className="nav-link" href="/login">Login</a>
                        </li> : null }
                        {localStorage.getItem("Authorization") === null ?
                        <li className="nav-item">
                            <a className="nav-link" href="/registration">Registration</a>
                        </li> : null }
                        {localStorage.getItem("Authorization") !== null ?
                        <li className="nav-item">
                            <a className="nav-link" href="/profile">Profile</a>
                        </li> : null }
                        {localStorage.getItem("Authorization") !== null ?
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={handleLogOut}>Log Out</a>
                        </li> : null }
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;

