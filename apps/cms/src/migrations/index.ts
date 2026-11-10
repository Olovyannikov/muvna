import * as migration_20261110_104720_initial from './20261110_104720_initial';
import * as migration_20261110_130401_media_sizes from './20261110_130401_media_sizes';

export const migrations = [
  {
    up: migration_20261110_104720_initial.up,
    down: migration_20261110_104720_initial.down,
    name: '20261110_104720_initial',
  },
  {
    up: migration_20261110_130401_media_sizes.up,
    down: migration_20261110_130401_media_sizes.down,
    name: '20261110_130401_media_sizes'
  },
];
