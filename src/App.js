import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import Request from 'superagent';
import Images from './Images';
import './App.css';

const IMAGE_THUMB_SIZE_FACTOR = 1;

const Buttons = ({ onStopStreams, onPlayFirstDevice, onGetDataUri, onClearPhotos }) => {
  return(
    <div>
      <button
        onClick={(e) => {
          onPlayFirstDevice();
        }}
      >Play</button>

      <button
        onClick={(e) => {
          onGetDataUri();
        }}
      >Photo</button>

      <button
        onClick={(e) => {
          onStopStreams();
        }}
      >Stop</button>

      <button
        onClick={(e) => {
          onClearPhotos();
        }}
      >Clear</button>
    </div>
  );
}

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataUris: [],
      isCameraRunning: false
    };
  }

  sendPicture = (dataUri) => {
    let url = "http://localhost:3000/api/photos";
    Request
      .post(url, {timeout: 1500})
      .accept('application/json')
      .type('application/json')
      .send({dataUri})
      .end((err, res) => {
          console.log('isPosting');
        if(! err && res.statusCode == 200){
          console.log('isPosted');
        } else if(res){
          console.log('error1');
        } else {
          console.log('error2');
        }
      });
  }

  getDataUri = () => {
    let dataUri = this.refs.camera.getDataUri(IMAGE_THUMB_SIZE_FACTOR);
    this.setState({
      dataUris: this.state.dataUris.concat(dataUri)
    });
    this.sendPicture(dataUri);
  }

  onClearPhotos = () => {
    this.setState({
      dataUris: []
    });
  }

  onCameraError = (error) => {
    let {code, message, name} = error;
    let strError = `
      Camera Error:
        code: ${code}
        message: ${message}
        name: ${name}`;
    console.error(strError);
  }

  onCameraStart = () => {
    console.log('camera start');
    this.setState({
      isCameraRunning: true
    });
  }

  onCameraStop = () => {
    console.log('camera stop');
    this.setState({
      isCameraRunning: false
    });
  }

  render() {

  let infoCamera = this.state.isCameraRunning
    ? <div className="txt-green"> Camera ON </div>
    : <div className="txt-red"> Camera OFF </div>

    return (
      <div className="App">

        <div className="camera">
          <Camera
            ref="camera"
            onCameraError = {this.onCameraError}
            autoPlay={true}
            onCameraStart = {this.onCameraStart}
            onCameraStop = {this.onCameraStop}
          />

          { infoCamera }

          <Buttons
            onStopStreams = {()=>{this.refs.camera.stopStreams()}}
            onPlayFirstDevice = {()=>{this.refs.camera.playFirstDevice()}}
            onGetDataUri = {()=>{this.getDataUri()}}
            onClearPhotos = {()=>{this.onClearPhotos()}}
          />
        </div>

        <Images
          dataUris = {this.state.dataUris}
        />
      </div>
    );
  }
}

export default App;
