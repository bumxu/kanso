export async function POST({ request }) {
    console.log('Saving data...');

    const body = await request.json();
    console.debug('body ->', body);

    return new Response('hola', {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}