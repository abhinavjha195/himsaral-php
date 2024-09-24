import React, { Component } from 'react';
import Sidebar from "../basic/Sidebar";
import HeaderMenu from "../basic/HeaderMenu";
import LogoNav from "../basic/LogoNav";  

class HeaderPart extends Component {
  render() {
    return (
       
       <div>	


      {/***********************************
        Nav header with Logo start
    ************************************/}

      <LogoNav />

      {/***********************************
        Nav header With Logo end
    ************************************/}  


      {/***********************************
        Header menu start
    ************************************/}

      <HeaderMenu />

      {/***********************************
        Header menu end ti-comment-alt
    ************************************/}  


      {/***********************************
        Sidebar start
    ************************************/}

      <Sidebar />

      {/***********************************
        Sidebar end
    ************************************/} 		
      
        </div>          
     
    );
  }
}  
export default HeaderPart;