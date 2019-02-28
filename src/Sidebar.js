//code reused and adapted from: facebook create-react-app see readme for link, udacity course work sign up at www.uadacity.com, Elhroy brilliant youtube tutorials https://www.youtube.com/watch?v=_1RjbT5dIeM&list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1&index=5
import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class Sidebar extends Component {

    state = {
        searchedLocations: []
 
    }


    // showClick = (id)=>{
    //     alert(id)
    //     this.props.handleClick(id);
    // }    
    

    /**
     * I using code from class at Udacity course lessons about controlled components see the link
     * https://classroom.udacity.com/nanodegrees/nd001/parts/c3e7b0d6-ffef-4421-b5fc-6df10fd0a1ae/modules/82766b2b-1870-4904-aa90-8ccbe63928c5/lessons/14331e60-a548-4cfb-a326-054545da8927/concepts/fc3f11d3-8779-4d8a-8a23-1cd782f8ddf3
     * tring to use reg exp and data attr correctly
     */ 


    render() {
        let showingLocations;
        if (this.props.query) {
            const match = new RegExp(escapeRegExp(this.props.query, 'i'))
            showingLocations = this.props.venues.filter((bestVenue) => match.test(bestVenue.venue.name))
        } else {
            showingLocations = this.props.venues
        }

        showingLocations.sort(sortBy('venue.name'))


        
        return (
            <div id="location-sidebar">
                {JSON.stringify(this.state.searchedLocations)}
                <h2 className="art-lyon" tabIndex="0">Nut Free Food and Restaurants Miami</h2>
                <p className="credits">This project was made with Google Maps and the Foursquare API.</p>
                <div id="search-field">
                    <input
                        className='search-locations'
                        id="search"
                        type='text'
                        placeholder='Search locations'
                        aria-label='Search for nut free food and food restaurants'
                        value={this.state.query}
                        onChange={(event) => this.props.updateQuery(event.target.value)}
                    />
                </div>
                <ul className="location-list">
                        {   
                            showingLocations
                                .map((bestVenue) => (
                                    <li
                                        key={bestVenue.venue.id}
                                        className="location-list-item"
                                        onClick={(event)=>this.props.handleClick(bestVenue.venue.id)}
                                    >
                                        <a href="#0"                                        // type="button"
                                        key={bestVenue.venue.id}
                                        data-buttoncoord={`${[bestVenue.venue.location.lng, bestVenue.venue.location.lat]}`}
                                        className="sidebar-button"
                                        // onClick={(event)=>this.props.handleClick(bestVenue.venue.id)}
                                        onClick={(event)=>this.props.handleClick(bestVenue.venue.id)}
                                        
                                        >
                                            Info
                                        </a>
                                        {bestVenue.venue.name}
                                    </li>
                                ))
                        }
                    </ul>
            </div>
        );
    }
}
 
export default Sidebar;