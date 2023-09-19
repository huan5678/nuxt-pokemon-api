export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const prompt1 = query.prompt1 as string;
  const prompt2 = query.prompt2 as string;
  const prefix = query.prefix as string;

  const prefixList = prefix.split(',');
  const apiPath = 'https://discord.com/api/v9/interactions';

  const wait = (milliseconds: number) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  async function createMidjourneyPost(givenPrompt: string, currentPrefix: string) {
    const token = process.env.DISCORD_TOKEN;
    const application_id = process.env.DISCORD_APPLICATION_ID;
    const channel_id = process.env.DISCORD_CHANNEL_ID;
    const session_id = process.env.DISCORD_SESSION_ID;
    const version = process.env.DISCORD_VERSION;
    const id = process.env.DISCORD_ID;

    const reqPrompt = `${givenPrompt} --${currentPrefix}`;
    await wait(2000);
    await fetch(`${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
      body: JSON.stringify({
        type: 2,
        application_id,
        channel_id,
        session_id,
        data: {
          version,
          id,
          name: 'imagine',
          type: 1,
          options: [{type: 3, name: 'prompt', value: `${reqPrompt}`}],
        },
        nonce: new Date().getTime(),
      }),
    });
  }

  prefixList
    .reduce<Promise<void>>(async (prevPromise, currentPrefix) => {
      await prevPromise;
      await createMidjourneyPost(prompt1 as string, currentPrefix);
    }, Promise.resolve())
    .then(() => {
      return prefixList.reduce<Promise<void>>(async (prevPromise, currentPrefix) => {
        await prevPromise;
        await createMidjourneyPost(prompt2 as string, currentPrefix);
      }, Promise.resolve());
    });
});
