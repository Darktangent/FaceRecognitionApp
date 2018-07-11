import React, { Component } from 'react';
//import logo from './logo.svg';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn1.js'
import Register from './components/Register/Register.js'
import Rank from './components/Rank/Rank'

const app = new Clarifai.App({
  apiKey: 'da534ae55016476abdfa667c1218da57'
 });

const particlesOptions={
  particles: {
      number:{
        value:30,
        density:{
          enable:true,
          value_area:800
        }
      }
      }
    }
  

class App extends Component {
  constructor(){

    super()
    this.state={
      input:'',
      imageUrl: '',
      box: {},
      route:'signIn',
      isSignedIn:false
    }
  }

  calculateFaceLocation=(data)=>{
   const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
    const image= document.getElementById('inputimage')
    const width = Number(image.width)
    const height= Number(image.height)
   return({
     leftCol : clarifaiFace.left_col *width,
     topRow: clarifaiFace.top_row *height,
     rightCol: width - (clarifaiFace.right_col * width),
     bottomRow: height - (clarifaiFace.bottom_row * height)
   })
  }

  displayFaceBox=(box)=>{
    console.log(box)
    this.setState({box:box})

  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }
  onButtonSubmit=()=>{

    this.setState({imageUrl:this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response=> 
      // do something with response
      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
      this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err))
    
  
  }

  onRouteChange=(route)=>{

    if (route==='signOut'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }

    this.setState({route:route})



  }

  render() {
    return (
      <div className="App">
      <Particles className="particles"
              params={particlesOptions}
              
            />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
       { this.state.route==='home'?
       <div>
       <Logo />
       <Rank />
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
       <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
       </div>
       : (

        this.state.route==='signIn'?
        <SignIn onRouteChange={this.onRouteChange} />
        : <Register onRouteChange={this.onRouteChange} />
       )
        
          
       }
      </div>
    );
  }
}

export default App;
/* da534ae55016476abdfa667c1218da57 */ 