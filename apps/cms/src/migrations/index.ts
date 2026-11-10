import * as migration_20261110_104720_initial from './20261110_104720_initial';

export const migrations = [
  {
    up: migration_20261110_104720_initial.up,
    down: migration_20261110_104720_initial.down,
    name: '20261110_104720_initial'
  },
];
