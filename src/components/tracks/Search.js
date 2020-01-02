import React, { Component } from "react";
import axios from "axios";
import { Consumer } from "../../context";
import Autosuggest from 'react-autosuggest';

let lastFmAPI;

if(process.env.NODE_ENV !== 'production'){
  lastFmAPI = process.env.REACT_APP_MM_KEY;
} else {
  lastFmAPI = process.env.REACT_APP_MM_KEY;
}

class Search extends Component {
  state = {
    trackTitle: "",
    suggestions :[]
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
              <div className='input-row'>
                <label htmlFor='trackTitle'>Song title</label>
                <Autosuggest
                  inputProps={{
                    placeholder: 'Song title..',
                    autoComplete: 'off',
                    name: 'trackTitle',
                    id: 'trackTitle',
                    value: this.state.trackTitle,
                    onChange: (_event, { newValue }) => {
                      this.setState({trackTitle:(newValue)});
                    }
                  }}
                  suggestions={this.state.suggestions}
                  onSuggestionsFetchRequested={async ({ value }) => {
                    if (!value) {
                      this.setState({suggestion:[]});
                      return;
                    }
                    try {
                      const result = await axios.get(
                        `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${value}&limit=5&api_key=${lastFmAPI}&format=json`
                      );
                      console.log(result.data.results.trackmatches.track);
                      
                      this.setState({suggestions:
                        result.data.results.trackmatches.track.map(row => ({
                          track: row.name,
                          artist: row.artist
                        }))
                      });
                    } catch (e) {
                      this.setState({suggestion:[]});
                    }
                  }}
                  onSuggestionsClearRequested={() => {
                    this.setState({suggestion:[]});
                  }}
                  getSuggestionValue={suggestion => suggestion.artist +' '+ suggestion.track}
                  renderSuggestion={suggestion => (
                    <div className='autocomplete'>
                      {suggestion.artist} - {suggestion.track}
                    </div>
                  )}
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