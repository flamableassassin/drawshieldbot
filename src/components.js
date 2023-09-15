import { ComponentType, ButtonStyle } from 'discord-api-types/v10';
import * as convertSVG from './utils/convertSVG';
/**
 * @param {import("discord-api-types/v10").APIMessageComponentButtonInteraction} interaction 
 * @param {import("@cloudflare/workers-types").ExecutionContext} context
 * @returns {Promise<import("@cloudflare/workers-types").Response>}
 */
// eslint-disable-next-line no-unused-vars
export async function execute(interaction, context) {
  // eslint-disable-next-line no-unused-vars
  const [componentName, ...ids] = interaction.data.custom_id.split('-');

  switch (componentName) {
    case 'randomblazon': {
      const response = await fetch('https://drawshield.net/include/randomblazon.php');
      const text = await response.text();
      const cleanedText = text.replace(/\s+/g, ' ');

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
    }

    default: {
      return { type: 4, data: { flags: 64, content: 'Oops this wasn\'t meant to happen. I have no clue how you got here' } };
    }

  }
}