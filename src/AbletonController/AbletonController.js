const { Ableton } = require("ableton-js");

const ableton = new Ableton();
let tracks = [];

const loadTracks = async () => {
  tracks = await ableton.song.get("tracks").catch((e) => {
    console.log("error loading tracks");
  });
};

const play = async (id) => {
  let trackToPlay = tracks[id];
  try {
    const isTrackMuted = await trackToPlay.get("mute");
    if (isTrackMuted) {
      const playing = await trackToPlay.set("mute", false);
    }
  } catch (err) {
    console.error(err);
  }
};

const mute = async (id) => {
  let trackToMute = tracks[id];
  try {
    const isTrackMuted = await trackToMute.get("mute");
    if (!isTrackMuted) {
      const mute = await trackToMute.set("mute", true);
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  loadTracks: loadTracks,
  play: play,
  mute: mute,
};
