import writeFileAtomic from 'write-file-atomic';
import * as msgpackr from 'msgpackr';

export async function POST({ request }) {
    console.log('Saving data...');

    const body = await request.json();
    console.debug('body ->', JSON.stringify(body));
    try {
        await writeFileAtomic(body.path, JSON.stringify(body.data));

        // save a copy of the file with body.data encoded with messagepack
        await writeFileAtomic(body.path + '.msgpack', msgpackr.pack(body.data));

        return new Response('ok', {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (error) {
        console.error(error);

        return new Response('error', {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
}