const { Ableton } = require("ableton-js");

const ableton = new Ableton();
let tracks = [];

ableton.on("connect", (e) => console.log("Connect", e));
ableton.on("message", (m) => console.log("Message:", m));

const loadTracks = async () => {
  tracks = await ableton.song.get("tracks");
};

const play = async (id) => {
  let trackToPlay = tracks[id];
  try {
    trackToPlay.set("mute", false);
  } catch (err) {
    console.error(err);
  }
};

const mute = async (id) => {
  let trackToMute = tracks[id];
  try {
    trackToMute.set("mute", true);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  loadTracks: loadTracks,
  play: play,
  mute: mute,
};
