import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataUri: ""
    };
  }

  onCameraError = (error) => {
    console.error(error)
  }

  getDataUri = () => {
    let dataUri = this.refs.camera.getDataUri();
    this.setState({dataUri});
  }

  render() {
    return (
      <div>
        <Camera
          ref="camera"
          onCameraError={this.onCameraError}
        />

        <button
          onClick={(e) => {
            this.getDataUri();
          }}
        >Photo</button>

        <img alt="camera" src={this.state.dataUri}/>
      </div>
    );
  }
}

export default App;
