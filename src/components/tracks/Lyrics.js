import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {},
    artist: {}
  };

  componentDidMount() {
    const { artist, track } = this.props.match.params;
    // console.log(artist);
    //console.log(track);

    axios
      .get(`https://api.lyrics.ovh/v1/${artist}/${track}`)
      .then(res => {
        this.setState({ lyrics: res.data });
      })

      .catch(err => console.log(err));
    axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=4653bcac743ebe7043f127687fe6c909&format=json`
      )
      .then(res => {
        this.setState({ artist: res.data.artist });
        //console.log(res.data.artist);
      })

      .catch(err => console.log(err));
    axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=4653bcac743ebe7043f127687fe6c909&artist=${artist}&track=${track}&format=json`
      )
      .then(res => {
        this.setState({ track: res.data.track });
        //console.log(res.data.track);
      })

      .catch(err => console.log(err));
  }

  render() {
    const { artist, track, lyrics } = this.state;
    if (artist.bio !== undefined) {
      var artist_summary = artist.bio.summary;
    } else {
      artist_summary = "";
    }
    if (track.wiki !== undefined) {
      var track_summary = track.wiki.summary;
    } else {
      track_summary = "";
    }

    if (track.album !== undefined) {
      var image = track.album.image[3]["#text"];
      var album_title = track.album.title;
    } else {
      image = "";
      album_title = "";
    }
    if (artist.tags !== undefined) {
      var tag = artist.tags.tag;
    } else {
      tag = "";
    }
    var text = "";
    for (let i = 0; i < tag.length; i++) {
      text += tag[i].name + ", ";
    }
    var tags = text.slice(0, -2);

    if (lyrics.lyrics === undefined) {
      lyrics.lyrics = "Sorry no lyrics :(";
    }

    //console.log(tags);

    // if (
    //   track === undefined ||
    //   lyrics === undefined ||
    //   Object.keys(track).length === 0 ||
    //   Object.keys(lyrics).length === 0
    // ) {
    //   return <Spinner />;
    // } else {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12">
            <Link to="/" className="btn btn-info btn-sm mb-4 float-right">
              Go Back
            </Link>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h3>{artist.name}</h3>
            <p id="tags">
              <strong>Genres: {tags}</strong>
            </p>
            <button
              className="btn btn-summary btn-info"
              type="button"
              data-toggle="collapse"
              data-target="#collapseArtist"
              aria-expanded="false"
              aria-controls="collapseArtist"
            >
              Artist info:
            </button>
            <div className="collapse" id="collapseArtist">
              <div
                className="card card-body"
                dangerouslySetInnerHTML={{ __html: artist_summary }}
              ></div>
            </div>
            <div className="text-center p-2">
              <img src={image} alt="" />
            </div>

            <h3>{track.name} </h3>
            <span>from the album</span>
            <h5> {album_title}</h5>

            <button
              className="btn btn-summary btn-info"
              type="button"
              data-toggle="collapse"
              data-target="#collapseTrack"
              aria-expanded="false"
              aria-controls="collapseTrack"
            >
              Track info:
            </button>
            <div className="collapse" id="collapseTrack">
              <div
                className="card card-body"
                dangerouslySetInnerHTML={{ __html: track_summary.slice(0, -2) }}
              ></div>
            </div>
            <p></p>
            <p>
              <strong>Lyrics: </strong>
            </p>
            <p className="card-text">{lyrics.lyrics}</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Lyrics;
