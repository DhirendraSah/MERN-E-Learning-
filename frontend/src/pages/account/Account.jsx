import React from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";

import { useNavigate } from "react-router-dom";



const Account = ({user}) => {
    const {setIsAuth,setUser} = userData()

    const navigate = useNavigate();

    const logoutHandler =() =>{
        localStorage.clear()
        setUser([])
        setIsAuth(false)
        toast.success("Loggod out");
        navigate("/login");
    }
    return (
        <div>
           {user &&  <div className="profile">
                <h2>My Profile</h2>
                <div className="profile-info">
                    <p>
                        <strong>{user.name}</strong>
                    </p>

                    <p>
                        <strong>{user.email}</strong>
                    </p>

                    <button className="common-btn">
                        <MdDashboard/>Dashboard
                        </button><br/> 

                    <button onClick={logoutHandler} className="common-btn" style={{background:"red", color:"white"}} >
                    <MdDashboard/>Logout
                        </button>  
                </div>
            </div>}
        </div>
    );
};

export default Account;