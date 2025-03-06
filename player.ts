import { Player } from './game/player.ts';
import  * as flatbuffers from "npm:flatbuffers";

export interface player {
  uuid : string | null;
  life : number;
}

 export function sPlayer(p : player): Uint8Array {
  const builder = new flatbuffers.Builder(1024); // Initial buffer size
  const uuidOffset = builder.createString(p.uuid);

  Player.startPlayer(builder);
  Player.addUuid(builder, uuidOffset);
  Player.addLife(builder, p.life);
  const playerOffset = Player.endPlayer(builder);

  builder.finish(playerOffset);
  return builder.asUint8Array();
}


export function dPlayer(data: Uint8Array): player {
  const buf = new flatbuffers.ByteBuffer(data);
  const toP = (p : Player) : player => ({ 
    uuid : p.uuid(),
    life : p.life()
  });
  return toP(Player.getRootAsPlayer(buf));
}

export async function writePlayer(filename : string,p: player) { 
  try {
    const serializeData = sPlayer(p);
    await Deno.writeFile(filename,serializeData);
    console.log(`Serialized data written to ${filename}`)
  } catch (error) {
    console.log(`Error writing to file ${error}`)
  }
}

export function readPlayer(filename: string): Promise<player> {
  return new Promise<player>((resolve,  reject) => {
    (async () => {
      try {
        const readData = await Deno.readFile(filename);
        console.log(`Data read from ${filename}:`, readData);
        return resolve(dPlayer(readData)); // Assuming dPlayer returns a player or undefined
      } catch (error) {
        return reject(error); // Explicitly return undefined on error
      }
    })()
  });
}




