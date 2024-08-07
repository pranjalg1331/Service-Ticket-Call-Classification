import React from 'react'

const Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary ">
      <div className="container">
                <a className="navbar-brand mx-5" href="#">
                    <img className="navbar-image d-inline-block align-text-top" src="src\assets\images\images.png" alt="img" width="30" height="24" ></img>
                    
                </a>
                <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                  </button>
            </div>
                
              
              <div className="collapse navbar-collapse px-5" id="navbarNav" >
                <ul className="navbar-nav  ms-auto">
                  <li className="nav-item">
                    <a className="nav-link " aria-current="page" href="#">Home</a>
                  </li>
                  <li className="nav-item ">
                    <a className="nav-link" href="#">Features</a>
                  </li>
                  <li className="nav-item  ">
                    <a className="nav-link" href="#">Pricing</a>
                  </li>
                
                </ul>
              </div>

            
        </nav>
        </>
  )
}

export default Navbar