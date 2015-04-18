define(function(require) {
  'use strict';

  var React = require('react');
  var YoutubeSearcher = require('backend/YoutubeSearcher');
  var TrackInfoFetcher = require('backend/TrackInfoFetcher');
  var TopRanking = require('backend/TopRanking');
  var Track = require('components/track');

  var TopRankingContainer = React.createClass({
    getInitialState: function() {
      return {
        tracks: []
      };
    },

    componentDidMount: function() {
      TopRanking.get().then((tracks) => {
        this.setState({
          tracks: tracks
        });
      });
    },

    _fetchDataFn: function(track) {
      // we have partial track information (from TopRanking), right now we
      // have to compose the right keywords to search and get the real url
      var promise = new Promise(function(resolve) {
        var keyword = track.artist + ' - ' + track.title;
        YoutubeSearcher.search(keyword, 1).then(function(tracks) {
          var trackInfo = tracks[0];
          resolve(trackInfo);
        });
      });
      return promise;
    },

    render: function() {
      var tracks = this.state.tracks;

      /* jshint ignore:start */
      return (
        <div className="topranking-container clearfix">
          {tracks.map((track) => {
            return <Track data={track} fetchDataFn={this._fetchDataFn.bind(null, track)}/>;
          })}
        </div>
      );
      /* jshint ignore:end */
    }
  });

  return TopRankingContainer;
});
