import { InteractionType } from 'discord-api-types/v10';
import { execute as commandsExecute } from './commands';
import { execute as componentsExecute } from './components';
const encoder = new TextEncoder();

export default {
  /**
   * 
   * @param {import("@cloudflare/workers-types").Request} request
   * @param {import("@cloudflare/workers-types").ExecutionContext} context
   */
  fetch: async (request, env, context) => {
    if (request.method !== 'POST' || !request.headers || !request.headers.get('X-Signature-Ed25519') || !request.headers.get('X-Signature-Timestamp')) return new Response(null, { status: 404 });
    const body = await request.text();
    const isVerified = await verify(request, body, env);
    if (!isVerified) return new Response(null, { status: 401 });

    /** @type {import("discord-api-types/v10").APIGuildInteraction} */
    const interaction = JSON.parse(body);



    switch (interaction.type) {
      case InteractionType.Ping: {
        return new Response(JSON.stringify({ type: 1 }), { status: 200 }, { headers: { 'Content-Type': 'application/json' } });
      }

      case InteractionType.ApplicationCommand: {
        const resp = await commandsExecute(interaction, context);
        if (resp instanceof Response) return resp; // Allowing the command to return its own response
        return new Response(JSON.stringify(resp), { headers: { 'Content-Type': 'application/json' } });
      }

      case InteractionType.MessageComponent: {
        const resp = await componentsExecute(interaction, context);
        if (resp instanceof Response) return resp; // Allowing the command to return its own response
        return new Response(JSON.stringify(resp), { headers: { 'Content-Type': 'application/json' } });
      }

      default: {
        return new Response(JSON.stringify({ type: 4, data: { flags: 64, content: 'Oops this wasn\'t meant to happen. I have no clue how you got here' } }), { headers: { 'Content-Type': 'application/json' } });
      }

    }
  }
};




// Modified version of https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1. Thanks advaith for that link

/**
 * @param {String} hex 
 * @returns {Uint16Array}
 */
function hex2bin(hex) {
  const out = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return out;
}


/**
 * @param {import("@cloudflare/workers-types").Request} request
 * @return {Promise<Boolean>}
 */
async function verify(request, body, env) {
  const signature = hex2bin(request.headers.get('X-Signature-Ed25519'));
  const timestamp = request.headers.get('X-Signature-Timestamp');
  const unknown = body;

  const PUBLIC_KEY = crypto.subtle.importKey(
    'raw',
    hex2bin(env.PUBKEY),
    {
      name: 'NODE-ED25519',
      namedCurve: 'NODE-ED25519'
    },
    true,
    ['verify']
  );

  return crypto.subtle.verify(
    'NODE-ED25519',
    await PUBLIC_KEY,
    signature,
    encoder.encode(timestamp + unknown)
  );
}