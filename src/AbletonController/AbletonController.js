const { Ableton } = require("ableton-js");

let tracks = [];
var ableton = new Ableton();

const loadTracks = async () => {
  try {
    tracks = await ableton.song.get("tracks");
    console.log("---- Tracks Loaded ----");
    console.log("TRACKS ARE ", tracks);
    setTimeout(() => {
      console.log("---- Starting the Script ----");
    }, 2000);
  } catch (err) {
    console.log(err);
  }
};

const play = async (id) => {
  let trackToPlay = tracks[id];
  try {
    const isTrackMuted = await trackToPlay.get("mute");
    if (isTrackMuted) {
      await trackToPlay.set("mute", false);
    }
  } catch (err) {
    console.error("Error playing track: ", id);
    console.error(err);
  }
};

const mute = async (id) => {
  let trackToMute = tracks[id];
  try {
    const isTrackMuted = await trackToMute.get("mute");
    if (!isTrackMuted) {
      await trackToMute.set("mute", true);
    }
  } catch (err) {
    console.error("Error muting track: ", id);
    console.error(err);
  }
};

const playAllTracks = async () => {
  tracks.forEach(async (track) => {
    try {
      const isTrackMuted = await track.get("mute");
      if (isTrackMuted) {
        await track.set("mute", false);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = {
  loadTracks: loadTracks,
  play: play,
  mute: mute,
  playAllTracks: playAllTracks,
};
