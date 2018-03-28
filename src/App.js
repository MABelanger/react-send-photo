import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import Request from 'superagent';
import Image from './Image';
import './App.css';

const IMAGE_THUMB_SIZE_FACTOR = 1;
const POST_REST_URL = '/api/photos';

const Buttons = ({ onStopStreams, onPlayLastDevice, onSendPicture }) => {
  return(
    <div>
      <button
        onClick={(e) => {
          onPlayLastDevice();
        }}
      >Play</button>

      <button
        onClick={(e) => {
          onStopStreams();
        }}
      >Stop</button>

    </div>
  );
}

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dataUri: "",
      isCameraRunning: false,
      isUploading: false,
      isError: false
    };
  }


  setDelayBetweenUpload = (delay) => {
    this.setState({
      isDelayBetweenUpload : true
    });
    setTimeout (()=>{
      this.setState({
        isDelayBetweenUpload : false
      });
    }, delay);
  }

  postPicture = (dataUri, url) => {
    return new Promise((resolve, reject) => {
      Request
        .post(url, {timeout: 1500})
        .accept('application/json')
        .type('application/json')
        .send({dataUri})
        .end((err, res) => {
          if(! err && res.statusCode === 200){
            resolve();
          } else if(res){
            reject(res);
          } else {
            reject({});
          }
      });
    });
  }

  /*
  this.setState({
    isUploading:false,
    isError: true
  });
  */

  sendPicture = () => {
    let url = POST_REST_URL;
    let dataUri = this.refs.camera.getDataUri(IMAGE_THUMB_SIZE_FACTOR);

    this.setState({
      dataUri
    });

    this.setDelayBetweenUpload(1000);
    this.postPicture(dataUri, url)
      .then(()=>{
        this.setState({
          isUploading:false
        });
      })
      .catch(()=>{
        this.setState({
          isUploading:false,
          isError: true
        });
      })
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

  getShowHideStyle(isDisplay) {
    let displayStyle = isDisplay
      ? {display: 'inline-block', width: '200px'}
      : {display: 'none'}

    return displayStyle;
  }


  render() {

    let infoCamera = this.state.isCameraRunning
      ? <div className="txt-green"> Camera ON </div>
      : <div className="txt-red"> Camera OFF </div>

    // if the image is not Uploading show only the camera.
    // if the image is uploading show only the image.
    let showHideStyleCamera =
      this.getShowHideStyle(!(this.state.isUploading || this.state.isDelayBetweenUpload))
    let showHideStyleImage =
      this.getShowHideStyle(this.state.isUploading || this.state.isDelayBetweenUpload)

    return (
      <div className="App">

        <div className="camera">

        <h4>Click on the video to send the picture</h4>
          <div style={showHideStyleCamera}>
            <Camera
              ref="camera"
              onCameraError = {this.onCameraError}
              onCameraStart = {this.onCameraStart}
              onCameraStop = {this.onCameraStop}
              onVideoClick = {()=>{
                this.sendPicture();
              }}
            />
          </div>

          <div style={showHideStyleImage}>
            <Image
              dataUri = {this.state.dataUri}
            />
          </div>

          { infoCamera }

          <Buttons
            onStopStreams = {()=>{
              this.refs.camera.stopStreams()
            }}
            onPlayLastDevice = {()=>{
              this.refs.camera.playLastDevice()
            }}
            onSendPicture = {()=>{
              this.sendPicture();
            }}
          />
        </div>


      </div>
    );
  }
}

export default App;
