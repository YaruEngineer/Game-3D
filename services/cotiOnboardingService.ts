
import { Contract, keccak256 } from "ethers";
import {
    generateRSAKeyPair,
    recoverUserKey,
    sign
} from "@coti-io/coti-sdk-typescript";

const ONBOARD_CONTRACT_ADDRESS = '0x60eA13A5f263f77f7a2832cfEeF1729B1688477c';

const ONBOARD_CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true,  "internalType": "address", "name": "_from",     "type": "address" },
            { "indexed": false, "internalType": "bytes",   "name": "userKey1", "type": "bytes" },
            { "indexed": false, "internalType": "bytes",   "name": "userKey2", "type": "bytes" }
        ],
        "name": "AccountOnboarded",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "bytes", "name": "publicKey", "type": "bytes" },
            { "internalType": "bytes", "name": "signedEK",  "type": "bytes" }
        ],
        "name": "onboardAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// STRICT IMPLEMENTATION: wallet is expected to match the interface required by the example code.
// This includes having a .privateKey property and being compatible with ethers.Contract.
export async function onboard(wallet: any) {
    const accountOnboardContract = new Contract(
        ONBOARD_CONTRACT_ADDRESS,
        JSON.stringify(ONBOARD_CONTRACT_ABI),
        wallet
    );

    const rsaKeyPair = generateRSAKeyPair();

    const signedEK = sign(keccak256(rsaKeyPair.publicKey), wallet.privateKey);

    const receipt = await (
        await accountOnboardContract.onboardAccount(
            rsaKeyPair.publicKey,
            signedEK,
            { gasLimit: 15000000 }
        )
    ).wait();

    const decodedLog = accountOnboardContract.interface.parseLog(receipt.logs[0]);

    if (!decodedLog) {
        console.error("AccountOnboarded event not found");
        console.log(receipt);
    }

    return recoverUserKey(
        rsaKeyPair.privateKey,
        decodedLog!.args.userKey1.substring(2),
        decodedLog!.args.userKey2.substring(2)
    );
}
