import {Coin} from "../core/coin";
import {Player} from "../core/player";
import {Lava} from "../core/lava";

export const levelChars = {
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  'o': Coin,
  '=': Lava,
  '|': Lava,
  'v': Lava
};