import React from "react";
import { Link } from "react-router-dom";
const Track = props => {
  const { track } = props;
  if (track.artist.name !== undefined) {
    var artist = track.artist.name;
  } else {
    artist = track.artist;
  }

  return (
    <div className="col-md-6">
      <div className="card mb-4">
        <div className="card-body text-center">
          <h5>{artist}</h5>
          <p className="card-text">
            <strong>
              <i className="fas fa-play"></i> Track
            </strong>
            : {track.name}
            <br />
          </p>

          <Link
            to={`lyrics/${artist}/${track.name}`}
            className="btn btn-info lyrics-btn"
          >
            <i className="fas fa-chevron-right"></i> View Lyrics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Track;
