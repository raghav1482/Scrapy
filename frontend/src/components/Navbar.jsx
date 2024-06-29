import React from "react";

const Navbar = ()=>{
    return(<div>
        <header className="header">
        <div className="logo">Scrapy</div>
        <div className="auth-buttons">
          <button className="login-button">Login</button>
          <button className="register-button">Register</button>
        </div>
      </header>
    </div>)
}

export default Navbar;