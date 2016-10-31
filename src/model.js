/* @flow */
import type { Track, Beats, EncodedTrack } from "./types";

import samples from "./samples.json";


// const bassNotes = "F2,Ab2,C3,Db3,Eb3,F3,Ab3".split(",").reverse();
// const bassNotes = "A1,C2,D2,E2,G2,A2,C3,D3,E3,G3,A3".split(",").reverse();
// const notes = "C,Db,D,Eb,E,F,Gb,G,Ab,A,Bb,B".split(",");
// const bassNotes = [...notes.map(n => n + "2"), ...notes.map(n => n + "3")].reverse();
const penta = "C,Eb,F,Gb,G,Bb".split(",");
const bassNotes = [...penta.map(n => n + "1"), ...penta.map(n => n + "2")].reverse().slice(3);



export function initTracks(): Track[] {
  return [
    {id: 1, type: "drum", name: "hihat-reso", vol: .4, muted: false,
     beats: "...X...X...X..XX".split("").map(x => x === "X" ? defaultBeat() : null)},
    {id: 2, type: "drum", name: "hihat-plain", vol: .4, muted: false,
     beats: "XXX.XXX.XXX.XX..".split("").map(x => x === "X" ? defaultBeat() : null)},
    {id: 3, type: "drum", name: "snare-vinyl01", vol: .9, muted: false,
     beats: "....X.......X...".split("").map(x => x === "X" ? defaultBeat() : null)},
    {id: 4, type: "drum", name: "kick-electro01", vol: .8, muted: false,
     beats: "X..X..X.X..XX..X".split("").map(x => x === "X" ? defaultBeat() : null)},
    {id: 5, type: "bass", name: "bass", vol: .3, muted: false,
     beats: "C1,,C1,,C2,,Bb1,C2,,F1,,Gb1,,G1,Bb1,C2".split(",").map(x => x !== "" ? defaultBeat(x) : null)},
  ];
}

export function initBeats(n: number): Beats {
  return new Array(n).fill(null);
}

function defaultBeat(note: ?string) {
  return {note: note || "A4", vol: 1, dur: "4n"};
}

export function getBassNotes(): string[] {
  return bassNotes;
}

export function addTrack(tracks: Track[]) {
  const id = Math.max.apply(null, tracks.map(t => t.id)) + 1;
  return [
    ...tracks, {
      id,
      name: "kick-electro01",
      type: "drum",
      vol: .8,
      muted: false,
      beats: initBeats(16),
    }
  ];
}

export function clearTrack(tracks: Track[], id: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, beats: initBeats(16)};
    }
  });
}

export function deleteTracks(tracks: Track[], id: number): Track[] {
  return tracks.filter((track) => track.id !== id);
}

export function toggleTrackBeat(tracks: Track[], id: number, index: number, note: string): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {
        ...track,
        beats: track.beats.map((beat, i) => {
          if (i === index) {
            return beat == null ? defaultBeat(note) : null;
          } else {
            return beat;
          }
        })
      };
    }
  });
}

export function setTrackVolume(tracks: Track[], id: number, vol: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, vol};
    }
  });
}

export function muteTrack(tracks: Track[], id: number): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, muted: !track.muted};
    }
  });
}

export function updateTrackSample(tracks: Track[], id: number, sample: string): Track[] {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, name: sample};
    }
  });
}

function encodeBeats(beats: Beats): string {
  return beats.map(beat => beat ? "1" : "0").join("");
}

function decodeBeats(encodedBeats: string): Beats {
  return encodedBeats.split("").map(beat => beat === "1");
}

export function encodeTracks(tracks: Track[]): EncodedTrack[] {
  return tracks.map(({beats, ...track}) => {
    return {...track, beats: encodeBeats(beats)};
  });
}

export function decodeTracks(encodedTracks: EncodedTrack[]): Track[] {
  return encodedTracks.map(({beats, ...encodedTrack}) => {
    return {...encodedTrack, beats: decodeBeats(beats)};
  });
}

export function randomTracks(): Track[] {
  const nT = Math.floor(4 + (Math.random() * 5));
  const drumTracks = new Array(nT).fill().map((_, i) => {
    return {
      id: i + 1,
      type: "drum",
      name: samples[Math.floor(Math.random() * samples.length)],
      vol: .33 + (Math.random() / 3 * 2),
      muted: false,
      beats: initBeats(16).map(_ => Math.random() > .75 ? {
        note: "A4",
        vol: 1,
        dur: "4n",
      } : null),
    }
  });
  const bassTrack = {
    id: nT + 1,
    type: "bass",
    name: "bassline",
    vol: .2 + (Math.random() / 4),
    muted: false,
    beats: initBeats(16).map(_ => Math.random() > .5 ? {
      note: bassNotes[Math.floor(Math.random() * bassNotes.length)],
      vol: .5 + (Math.random() / 3),
      dur: "4n",
    } : null),
  };
  return [...drumTracks, bassTrack];
}

export function randomSong(): {bpm: number, tracks: Track[]} {
  return {
    bpm: Math.floor(Math.random() * 75) + 75,
    tracks: randomTracks(),
  };
}
