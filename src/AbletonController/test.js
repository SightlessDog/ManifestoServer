const { Ableton } = require("ableton-js");

const ableton = new Ableton();

const test = async () => {
  ableton.song.addListener("is_playing", (p) => console.log("Playing:", p));
  ableton.song.addListener("tempo", (t) => console.log("Tempo:", t));
};

test();
