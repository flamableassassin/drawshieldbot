// The command data to be sent to discord

import { ApplicationCommandOptionType } from 'discord-api-types/v10';

/** @type {import("discord-api-types/v10").APIApplicationCommand[]} */
export const data = [{
  name: 'draw',
  description: 'Draw a shield',
  type: 1,
  options: [{
    name: 'blazon',
    description: 'The blazon to draw',
    type: ApplicationCommandOptionType.String,
    required: true
  }, {
    name: 'shape',
    description: 'The shape of the output',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: ['heater', 'heater', 'french', 'oval', 'lozenge', 'square', 'italian', 'swiss', 'english', 'german', 'horsehead', 'polish', 'spanish', 'circle', 'sca', 'hungarian', 'scutum', 'african', 'persian', 'swatch', 'pauldron', 'stamp', 'flag'].map(i => ({ name: i, value: i }))
  }, {
    name: 'palette',
    description: 'The colour palette used',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: ['wikipedia', 'drawshield', 'wappenwiki', 'cc3', 'flat', 'english', 'emoji', 'bajuvarian', 'hatching', 'outline'].map(i => ({ name: i, value: i })) // I think you can do custom palettes but I have no clue how to do that as the docs are less than useful for it
  }, {
    name: 'effect',
    description: 'The effect to apply',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: ['shiny', 'plain', 'stonework', 'plaster', 'vellum', 'ripples', 'fabric', 'inked'].map(i => ({ name: i, value: i }))
  }]
}, {
  name: 'define',
  description: 'Get the definition of a term',
  type: 1,
  options: [{
    name: 'term',
    description: 'The term to define',
    type: ApplicationCommandOptionType.String,
    required: true
  }, {
    name: 'source',
    description: 'The source of the term',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: [{
      name: 'Parker\'s Heraldic Dictionary',
      value: 'parker'
    }, {
      name: 'Elvins\' Heraldic Dictionary',
      value: 'elvin'
    }]
  }]
}, {
  name: 'random-blazon',
  description: 'Get a random blazon',
  type: 1
}, {
  name: 'gallery',
  description: 'Search the gallery',
  options: [{
    name: 'term',
    type: ApplicationCommandOptionType.String,
    description: 'The search term',
    required: false
  }, {
    name: 'id',
    type: ApplicationCommandOptionType.String,
    description: 'The id of the gallery item',
    required: false
  }]
}, {
  name: 'challenge',
  description: 'Try your hand at a challenge. Recreate the image sent',
  options: [{
    name: 'source',
    description: 'Choose from a sources or choose from all of them',
    type: ApplicationCommandOptionType.String,
    required: false,
    choices: [
      { value: 'coadb', name: 'coadb - coadb.com catalog of European surnames(32,000 entries, monochrome)' },
      { value: 'wikimedia', name: 'wikimedia - Wikimedia commons(243, genuine DrawShield, colour)' },
      { value: 'public', name: 'public - The Book of Public Arms(1, 200 entries, monochrome)' },
      { value: 'all', name: 'All of them combined' }
    ]
  }]
}, {
  name: 'invite',
  description: 'Get my invite link'
}];