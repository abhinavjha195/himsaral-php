import React, { Component } from 'react';  

class Preloader extends Component {
  render() {
    return (           
        <div id="preloader">
        <div className="sk-three-bounce">
          <div className="sk-child sk-bounce1" />
          <div className="sk-child sk-bounce2" />
          <div className="sk-child sk-bounce3" />
        </div>
      </div>      
    );
  }
}  

export default Preloader;			