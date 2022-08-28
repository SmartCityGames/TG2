import { create, globSource } from 'ipfs';

import { writeFile } from 'fs';

var nfts = { files: [] };

const globSourceOptions = {
    recursive: true
};

const addOptions = {
    pin: true,
    wrapWithDirectory: true,
    timeout: 100000
};

async function main() {
    const ipfs = await create();

    for await (const file of ipfs.addAll(globSource('./nft-images', '**/*', globSourceOptions), addOptions)) {
        console.log(file);
        nfts.files.push({ path: file.path, cid: file.cid.toString() });
    }

    const data = JSON.stringify(nfts);

    writeFile('ipfs-nfts.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

main();
