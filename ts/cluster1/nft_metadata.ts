import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/2g3GHZFEVV71SzXk7zoLPbiXmB3WR4crUTVoJDjUn2yC"
        const metadata = {
            name: "Epic Rug",
            symbol: "ER",
            description: "An absolutely epic rug",
            image: image,
            attributes: [
                {trait_type: 'rarity', value: 'epic'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://devnet.irys.xyz/2g3GHZFEVV71SzXk7zoLPbiXmB3WR4crUTVoJDjUn2yC"
                    },
                ]
            },
            creators: [
                {
                    address: "6c4LWWtKYGd2Bz37XX9CgKMmLa5AeJekYexo1Wr96Twa", // Replace with the actual wallet address of the creator
                    share: 100,                     // Percentage of royalties for this creator (out of 100)
                    verified: true                  // Set to true if the creator is verified
                }
            ]
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
