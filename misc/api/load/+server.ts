import fs from 'node:fs/promises';

export async function POST({ request }) {
    console.log('Loading data...');

    const file = await fs.readFile('C:/Users/admin/OneDrive/j4dataSSR.json', { encoding: 'utf8' });

    return new Response(file, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}