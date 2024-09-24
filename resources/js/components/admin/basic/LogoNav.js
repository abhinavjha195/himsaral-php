import React, { Component } from 'react';  

const base_url=location.protocol+'//'+location.host+'/';  

class LogoNav extends Component {
  render() {
    return (          
        <div className="nav-header">
            <a href={`/dashboard`} className="brand-logo">				
              {/*img class="logo-abbr" src="./images/logo.png" alt=""*/}
               <img className="logo-compact" src={`${base_url}images/logo-himsaral.png`} alt="" />
               <img className="brand-title" src={`${base_url}images/logo-text.png`} alt="" />  
            </a>
            <div className="nav-control">
              <div className="hamburger">
                <i className="fa fa-angle-double-left" aria-hidden="true" />
              </div>
            </div>
          </div>       
    );
  }
}  

export default LogoNav;		