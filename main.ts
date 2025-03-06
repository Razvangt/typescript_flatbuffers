import { player, readPlayer,writePlayer } from "./player.ts";


const p : player = {
  uuid : "dasifazsrfa",
  life : 10
};


const filename = 'player_data.bin'

writePlayer(filename,p);


readPlayer(filename).then(
  (result)=> {
    console.log('readPlayer data: ',result );
  },
  (reject) => {
    console.log('controled error: ',reject);
  }
);



