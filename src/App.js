//code reused and adapted from: facebook create-react-app see readme for link, udacity course work sign up at www.uadacity.com, Elhroy brilliant youtube tutorials https://www.youtube.com/watch?v=_1RjbT5dIeM&list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1&index=5 

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios'


import Sidebar from './Sidebar'
import escapeRegExp from 'escape-string-regexp'


class App extends Component {

state = {
    venues: [],
    markerProperties: {
        color: "purple"
    },
    isActiveMarker: null,
    query: '',
    markers: [],
    showingMarkers: []

}
//this.loadMap() removed this to prevent the map loading without markers before the data is retrieved 
componentDidMount(){
  this.fetchVenues()
//    load_JS_script("https://maps.googleapis.com/maps/api/js?key=AIzaSyBI2NsfPB7PeL1AAyX1od84K3_nAhht5TA&callback=initMap")
//       window.initMap = this.initMap
  
}

  loadMap = () => {
    
      load_JS_script("https://maps.googleapis.com/maps/api/js?key=AIzaSyBI2NsfPB7PeL1AAyX1od84K3_nAhht5TA&v=3&callback=initMap")
      window.initMap = this.initMap
  }
    


 // function with api data to start working with axios 
fetchVenues = () => {
 
  let endPoint = "https://api.foursquare.com/v2/venues/explore?"



  let fourSquareParameters = {
                  client_id: "MAJNLNVIYQ5MUARVEBF3QSVXYBSRHQ4Z0VSCQL2W2O5ANCGN",
                  client_secret: "RKEONVPNYRLKVGRSZOFJ41JPPGTX4T2CB0IFNZOH002RRPVG",
                  query: "nut free food",
                  near: 'Miami',
                  limit: 33,
                  v: "20190225"                  
  }
  // use axios to pull the response data fom fourquare api used endpoint above with fourSquareParameters to create the url to pass here (endPoint + new URLSearchParams(fourSquareParameters)
  axios.get(endPoint + new URLSearchParams(fourSquareParameters))
  .then(response => {
    this.setState({
      venues: response.data.response.groups[0].items, 
    }, this.loadMap())
    console.log(response.data.response.groups[0].items)
  })
  .catch(err =>{
    alert("Error at present with retrieving data from Foursquare sorry for any inconvenience, please try again later")
    console.log("Error " + err)
  })
}

 initMap = () => {
     let markers = [];
    //create a map
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.761681, lng: -80.191788},
        zoom: 12
      })

    // creatng a google map feature called an info window that will ensure just one is open at a time 
    let infowindow = new window.google.maps.InfoWindow();

      // display dynamic markers
      this.state.venues.map( bestVenue =>  {

      // info to display to users inside the info window
      let infoWindowInfo = 
      `<h1>${bestVenue.venue.name} </h1><h2> ${bestVenue.venue.categories[0].name}</h2> <h2> ${bestVenue.venue.location.formattedAddress[0]} 
      </h2> <h2> ${bestVenue.venue.location.formattedAddress[1]} </h2> `;
      //**style in font size and another detail

      // creating a marker
      let marker = new window.google.maps.Marker({
        position: {lat: bestVenue.venue.location.lat, lng: bestVenue.venue.location.lng},
        map: map,
        //title: bestVenue.venue.name
        id : bestVenue.venue.id
      });
      /* link the marker and info window together to create a info window that opens when the marker is clicked displaying details about the venue
      *  from the venue data you click on a marker and it will also animate the marker to bounce for 2 seconds */
      marker.addListener('click', function() {

            // set the info that displayes inside the venue windo
            infowindow.setContent(infoWindowInfo)

            // open an info window n the map
            infowindow.open(map, marker);

            /* added a bounce animation to the marker when it s clicked
            *  personally i prefer if it kept bouncing as it would help me remember the ones i already
            *  clicked but as animations never stop i will add a setTimeout() to make it stop*/
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
            
            window.setTimeout(function(){
                marker.setAnimation(null);
                }, 2000);

               

      });
      // update makers state 
      markers.push(marker); 
      console.log(markers)
      this.setState({ markers })
      })
      
}

 /**
     * I used Elharony's tutorial to fix a problem to ensure i used FourQuare correct and fix issues
     * https://www.youtube.com/watch?v=_1RjbT5dIeM&list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1&index=5
    */
    

// activate markers upon click event
 activateMarker = (e) => {
        e.preventDefault();
        e.currentTarget.classList.toggle("flash")
    }
 
    handleClick(e) {
        
       //alert(e);
        let {markersArray }= this.state.markers

        console.log('handle',this.state.markers)
        this.state.markers.map(marker => {
            return marker.id === e ? new window.google.maps.event.trigger(marker, 'click') : ''
        })        
    }

    // update query and markers query
    updateQuery = (query) => {
        this.setState({ query: query })
        this.updateMarkers(query);
    }


 /**
 * filter markers here
 */
    updateMarkers = (query) => {
        let showingMarkers = this.state.markers;
    
        if (query) {
            const match = new RegExp(escapeRegExp(query.toLowerCase(), 'i'))
            showingMarkers = this.state.markers.filter((myMarker) => {
                return match.test(
                    myMarker.getElement().data.toLowerCase()
                )
            }
            )
            this.setState({
                showingMarkers: showingMarkers
            })
        } else {
            this.setState({ showingMarkers: this.state.markers })
        }
    }


  render(){

    return(
                    

    <div className="App">
                <main className="container">
                    <div id="map" role="application" tabIndex="0">
                    </div>

                    <aside id="sidebar">
                        <Sidebar
                            venues={this.state.venues}
                            handleClick={this.handleClick.bind(this)}
                            markers={this.state.markers}
                            activateMarker={this.activateMarker}
                            query={this.state.query}
                            updateQuery={this.updateQuery}
                            showingMarkers={this.state.showingMarkers}
                        />
                    </aside>
                   
                </main>
            </div>


      );
  }
}
     





let load_JS_script = (javascriptURL) => {

  let indexRef = window.document.getElementsByTagName("script")[0]

  let script = window.document.createElement("script")  

  script.src = javascriptURL

  script.async = true

  script.defer = true

  indexRef.parentNode.insertBefore(script, indexRef)
}



window.gm_authFailure=(err)=>{
    let gMapError = document.querySelector('#map');
    gMapError.innerHTML = `<div class='gMapError'> Google Map Error try use menu or try again later sorry for any inconvenience </div>`;    
}


export default App;


