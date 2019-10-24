import React, { Component } from "react";
import axios from "axios";
import { Consumer } from "../../context";
//import Spinner from "../layout/Spinner";


let lastFmAPI;

if(process.env.NODE_ENV !== 'production'){
  lastFmAPI = process.env.REACT_APP_MM_KEY;
} else {
  lastFmAPI = process.env.MM_KEY;
}

class Search extends Component {
  state = {
    trackTitle: ""
  };

  findTrack = (dispatch, e) => {
    e.preventDefault();
    axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.state.trackTitle}&limit=10&api_key=${lastFmAPI}&format=json`
      )
      .then(res => {
        dispatch({
          type: "SEARCH_TRACKS",
          payload: res.data.results.trackmatches.track
        });

        this.setState({ trackTitle: "" });
        console.log(res.data.results.trackmatches.track);
      })
      .catch(err => console.log(err));
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card card-body mt-4 mb-4 p-4">
              <h1 className="display-4 text-center">
                <i className="fas fa-headphones"></i> Search For A Song
              </h1>
              <p className="lead text-center">Get the lyrics for any song</p>
              <form onSubmit={this.findTrack.bind(this, dispatch)}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Song title..."
                    className="form-control form-control-lg"
                    name="trackTitle"
                    value={this.state.trackTitle}
                    onChange={this.onChange}
                  />
                </div>
                <button
                  className="btn btn-info btn-lg btn-block mb-5"
                  type="submit"
                >
                  Get Track Lyrics
                </button>
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Search;
