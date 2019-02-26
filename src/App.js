import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios'
//AIzaSyDqhm1V_wMrOpmS8Ftc_67Ob--QMsQ4MRQ
class App extends Component {

state = {
    venues: []

}
//this.loadMap() removed this to prevent the map loading without markers before the data is retrieved 
componentDidMount(){
  this.getVenues()
  
}

  loadMap = () => {
      load_JS_script("https://maps.googleapis.com/maps/api/js?key=AIzaSyBI2NsfPB7PeL1AAyX1od84K3_nAhht5TA&callback=initMap")
      window.initMap = this.initMap
  }

 // function with api data to start working with axios 
getVenues = () => {
  let endPoint = "https://api.foursquare.com/v2/venues/explore?"
  let parameters ={
                  client_id: "MAJNLNVIYQ5MUARVEBF3QSVXYBSRHQ4Z0VSCQL2W2O5ANCGN",
                  client_secret: "RKEONVPNYRLKVGRSZOFJ41JPPGTX4T2CB0IFNZOH002RRPVG",
                  query: "food",
                  near: "Sydney",
                  v: "20190225"                  
  }

  axios.get(endPoint + new URLSearchParams(parameters))
  .then(response => {
    this.setState({
      venues: response.data.response.groups[0].items
    }, this.loadMap())
    //console.log(response.data.response.groups[0].items)
  })
  .catch(error =>{
    console.log("Error " + error)
  })
}

 initMap = () => {
    //create a map
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      })

    // creatng an info window that will ensure just one is open at a time
    let infowindow = new window.google.maps.InfoWindow();

      // display dynamic markers
      this.state.venues.map( bestVenue =>  {

      let contentString = `${bestVenue.venue.name}`;

      // creating a marker
      let marker = new window.google.maps.Marker({
        position: {lat: bestVenue.venue.location.lat, lng: bestVenue.venue.location.lng},
        map: map,
        //title: bestVenue.venue.name
      });
          
      // link the marker and info window together to create a info window that opens when the marker is clicked
      //click on a marker
      marker.addListener('click', function() {

            //change the content
            infowindow.setContent(contentString)

            //open an info window
            infowindow.open(map, marker);
      });

      })
}


  render() {
    return (
      <main>
          <div id="map">
          </div>
      </main>
    );
  }

}

// create this script tag with javascript below <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script> 
let load_JS_script = (javascriptURL) => {
  //selected the first script tag
  let indexRef = window.document.getElementsByTagName("script")[0]
  //created the script tag
  let script = window.document.createElement("script")  

  script.src = javascriptURL

  script.async = true

  script.defer = true
  //instead of using appendChild use the indexRef reference node get it's parent node insert before it the script newNode which keeps it at the beginning of the list of scripts
  indexRef.parentNode.insertBefore(script, indexRef)
}



export default App;
