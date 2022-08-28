import { readFile } from "fs/promises";

async function main() {
  const nfts = JSON.parse(await readFile("./ipfs-nfts.json"));

  const grouped = nfts.files.reduce((acc, nft) => {
    const [name, ext] = nft.path.split(".");
    if (!name) return acc;
    return {
      ...acc,
      [name]: {
        ...(acc?.[name] ?? {}),
        [ext]: nft.cid,
      },
    };
  }, {});

  console.log(JSON.stringify(grouped));
}

main();
