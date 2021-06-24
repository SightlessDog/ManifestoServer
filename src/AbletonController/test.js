const { Ableton } = require("ableton-js");

const ableton = new Ableton();

const test = async () => {
  const tracks = await ableton.song.get("tracks");
  const mixer = await tracks[0].get("mixer_device");
  const volume = await mixer.get("volume");
  console.log("Volume:", volume);
};

test();
