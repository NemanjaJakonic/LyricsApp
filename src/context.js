import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

let lastFmAPI;

if(process.env.NODE_ENV !== 'production'){
  lastFmAPI = process.env.REACT_APP_MM_KEY;
} else {
  lastFmAPI = process.env.MM_KEY;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_TRACKS":
      return {
        ...state,
        track_list: action.payload,
        heading: "Search Results"
      };
    default:
      return state;
  }
};

export class Provider extends Component {
  state = {
    track_list: [],
    heading: "Top 10 Tracks",
    dispatch: action => this.setState(state => reducer(state, action))
  };
  componentDidMount() {
    axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=10&api_key=${lastFmAPI}&format=json`
      )
      .then(res => {
        //console.log(res.data.tracks.track);
        this.setState({ track_list: res.data.tracks.track });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
