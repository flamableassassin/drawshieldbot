import { InteractionResponseType as ResponseType, ComponentType, ButtonStyle } from 'discord-api-types/v10';
// import * as convertSVG from './utils/convertSVG';
import * as convertSVG from './utils/convertSVG';
/**
 * @param {import("discord-api-types/v10").APIChatInputApplicationCommandGuildInteraction} interaction 
 * @param {import("@cloudflare/workers-types").ExecutionContext} context
 * @returns {Promise<import("discord-api-types/v10").APIInteractionResponse>}
 */
// eslint-disable-next-line no-unused-vars
export async function execute(interaction, context) {
  const command = interaction.data.name;
  switch (command) {

    case 'invite': {
      return {
        type: ResponseType.ChannelMessageWithSource, data: {
          embeds: [{
            title: 'Here is my invite link',
            url: `https://discord.com/oauth2/authorize?client_id=${interaction.application_id}&scope=bot%20applications.commands`,
            description: 'This bot is open source check it out here:\nhttps://github.com/flamableassassin/drawshieldbot',
            color: Math.floor(Math.random() * 16777216) // Random colour
          }]
        }
      };
    }

    case 'random-blazon': {
      const response = await fetch('https://drawshield.net/include/randomblazon.php');
      const text = await response.text();
      const cleanedText = text.replace(/\s+/g, ' '); // Removing white spaces to reduce the url sizes, could remove comments?

      /** @type {import("discord-api-types/v10").APIInteractionResponseCallbackData} */
      const payload = {
        embeds: [{
          title: 'Random Blazon',
          description: `\`\`\`${text}\`\`\``,
          image: {
            url: 'attachment://file.png'
          },
          color: Math.floor(Math.random() * 16777216) // Random colour
        }],
        components: [{
          type: ComponentType.ActionRow,
          components: [{
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: 'https://drawshield.net',
            label: 'Vist drawshield.net'
          }, {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: `https://drawshield.net/create/index.html?blazon=${encodeURIComponent(cleanedText)}`,
            label: 'Edit on drawshield.net'
          }]
        }, {
          type: ComponentType.ActionRow,
          components: [{
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            label: 'Get another',
            custom_id: 'randomblazon'
          }]
        }]
      };

      const png = await convertSVG.generate(`https://drawshield.net/include/drawshield.php?blazon=${encodeURIComponent(cleanedText)}`);
      const form = new FormData();
      form.append('payload_json', JSON.stringify(payload));
      form.append('files0', png, 'file.png');


      // eslint-disable-next-line no-unused-vars
      context.waitUntil(new Promise((resolve, reject) => {
        setTimeout(async () => {

          await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
            method: 'PATCH',
            body: form,
            Headers: {
              'User-Agent': 'DiscordBot ($highlyflammable.tech, $1)',
              'Content-Type': 'multipart/form-data'
            }
          });

          resolve();
        }, 10);
      }));
      return new Response(JSON.stringify({ type: 5 }), { headers: { 'Content-Type': 'application/json' } });
      // return new Response(form, { headers: { 'Content-Type': 'multipart/form-data' } });

    }

    case 'define': {
      const term = interaction.data.options.find(option => option.name === 'term').value;
      let url = `https://drawshield.net/api/define/${encodeURIComponent(term)}`;

      let sourceOption;
      if (interaction.data.options.length > 1) {
        sourceOption = interaction.data.options.find(option => option.name === 'source');
        const source = sourceOption ? sourceOption.value : null;
        url += `&source=${source}`;
      }

      const response = await fetch(url);
      const json = await response.json();
      // If there was an error in getting the definition
      if (json.error) return { type: ResponseType.ChannelMessageWithSource, data: { content: json.error, flags: 64 } };

      /** @type {import("discord-api-types/v10").APIInteractionResponse} */
      const responseData = {
        type: ResponseType.ChannelMessageWithSource,
        data: {
          embeds: [{
            title: 'Here\'s what I found',
            url: json.URL,
            description: json.content,
            color: Math.floor(Math.random() * 16777216) // Random colour
          }],
          components: [{
            type: ComponentType.ActionRow,
            components: [{
              type: ComponentType.Button,
              url: json.URL,
              label: 'View on drawshield.net',
              style: ButtonStyle.Link
            }]
          }]
        }
      };

      // If the user chose a source
      if (interaction.data.options.length > 1) responseData.data.embeds[0].footer = { text: `Source: ${sourceOption.value}` };

      return responseData;

    }


    case 'draw': {
      const blazon = interaction.data.options.find(i => i.name === 'blazon').value;
      const urlOptions = interaction.data.options.filter(i => i.name !== 'blazon');
      const baseImgUrl = `https://drawshield.net/include/drawshield.php?blazon=${encodeURIComponent(blazon)}` + urlOptions.map(i => `&${i.name}=${encodeURIComponent(i.value)}`);

      const payload = {
        embeds: [{
          title: 'Drawshield',
          image: {
            url: 'attachment://file.png'
          },
          description: `\`\`\`${blazon}\`\`\``,
          color: Math.floor(Math.random() * 16777216) // Random colour
        }],
        components: [{
          type: ComponentType.ActionRow,
          components: [{
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: 'https://drawshield.net',
            label: 'Vist drawshield.net'
          }, {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: baseImgUrl,
            label: 'View SVG on drawshield.net'
          }, {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: `https://drawshield.net/create/index.html?blazon=${encodeURIComponent(blazon)}`,
            label: 'Continue editing on drawshield.net'
          }]
        }]
      };

      const png = await convertSVG.generate(baseImgUrl);
      const form = new FormData();
      form.append('payload_json', JSON.stringify(payload));
      form.append('files0', png, 'file.png');


      // eslint-disable-next-line no-unused-vars
      context.waitUntil(new Promise((resolve, reject) => {
        setTimeout(async () => {

          await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
            method: 'PATCH',
            body: form,
            Headers: {
              'User-Agent': 'DiscordBot ($highlyflammable.tech, $1)',
              'Content-Type': 'multipart/form-data'
            }
          });

          resolve();
        }, 10);
      }));
      return { type: ResponseType.DeferredChannelMessageWithSource };
    }

    case 'gallery': {
      if (!interaction.data.options) return { type: ResponseType.ChannelMessageWithSource, data: { flags: 64, content: 'Error: Missing options. Please add an options' } };

      // Setting up a basic response payload to make life a bit easier
      /** @type {import("discord-api-types/v10").APIInteractionResponseChannelMessageWithSource} */
      const payload = { type: ResponseType.ChannelMessageWithSource, data: { embeds: [] } };

      /** @type {string} */
      let query = interaction.data.options[0].value;
      if (interaction.data.options[0].name === 'id' && query.length < 6) query = ('0').repeat(query.length - 6) + query; // Adding 0 to the start of the id
      const url = `https://drawshield.net/api/gallery/${query}`;
      const data = await (await fetch(url)).text();
      if (data.startsWith('"Sorry, nothing found for') || data.startsWith('""No gallery entry found for')) {
        payload.data.content = 'Nothing was found for that query';
        payload.data.flags = 64;
        return payload;
      }
      const isSingle = data.startsWith('"http:\\/\\/drawshield.net\\/gallery'); // Hope this works
      if (isSingle) {
        const temp = await fetch(`https://drawshield.net/gallery/getvotes.php?refnum=${query}`);
        const likes = await (temp.text());
        const startingID = query.slice(0, 4);
        payload.data.embeds.push({
          title: 'Here\'s what I found',
          url: `https://drawshield.net/gallery/${startingID}/gallery-${query}.html`,
          color: Math.floor(Math.random() * 16777216), // Random colour
          image: {
            url: `https://drawshield.net/gallery/${startingID}/img/gallery-${query}.png`
          },
          footer: {
            text: `${likes} Likes`
          }
        });
        return payload;
      } else {
        /** @type {import("discord-api-types/v10").APIEmbed[]} */
        const embeds = await Promise.all(data
          .slice(1, -1) // Removing " from the start and ending
          .split('\\n') // Splitting by entry
          .slice(0, 3) // Making the max 3 because of discord embed char limits which is 6000 for all embeds
          .map(async (i) => {
            console.log(i);
            const id = i.split(' ')[0];
            const startingID = id.slice(0, 4);
            const likes = await (await fetch(`https://drawshield.net/gallery/getvotes.php?refnum=${id}`)).text();
            return {
              title: id,
              color: Math.floor(Math.random() * 16777216), // Random colour
              url: `https://drawshield.net/gallery/${startingID}/gallery-${id}.html`,
              image: {
                url: `https://drawshield.net/gallery/${startingID}/img/gallery-${id}.png`
              },
              description: `\`\`\`${i.replace(/`/g, '\\`').substring(0, 1500)}\`\`\``, // escaping ` chars and limiting the description to 1500 chars because of embed char limits
              footer: {
                text: `${likes} Likes`
              }
            };
          }));
        payload.data.embeds = embeds;
        return payload;

      }

    }

    case 'challenge': {
      const source = !interaction.data.options ? 'all' : interaction.data.options[0].value;
      const challenge = JSON.parse(await (await (fetch(`https://drawshield.net/api/challenge/${source}`))).text());

      if (Object.hasOwn(challenge, 'error')) return { type: ResponseType.ChannelMessageWithSource, data: { content: 'Something went wrong sorry', flags: 64 } };
      // TODO: Handle SVGs
      // ? Button for when a user is done?
      return {
        type: ResponseType.ChannelMessageWithSource,
        data: {
          embeds: [{
            title: 'Here is your challenge',
            image: {
              url: challenge
            }
          }]
        }
      };
    }

    default: {
      return { type: ResponseType.ChannelMessageWithSource, data: { flags: 64, content: 'Oops this wasn\'t meant to happen. I have no clue how you got here' } };
    }
  }
}