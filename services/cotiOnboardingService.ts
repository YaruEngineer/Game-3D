import { Contract, keccak256, getBytes } from "ethers";
import { generateRSAKeyPair, recoverUserKey } from "@coti-io/coti-sdk-typescript";

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

export const onboardAccount = async (signer: any) => {
    console.log("Starting COTI Onboarding...");

    // 1. Generate RSA Key Pair
    // The SDK handles the generation.
    const rsaKeyPair = generateRSAKeyPair();
    console.log("RSA Key Pair generated.");

    // 2. Sign Public Key
    // In a browser environment (MetaMask), we cannot access the private key directly.
    // We use signer.signMessage() to sign the hash of the public key.
    // Ensure the public key is treated correctly (string/bytes).
    const pubKeyHash = keccak256(rsaKeyPair.publicKey);
    
    // Note: signMessage adds the "\x19Ethereum Signed Message:\n" prefix.
    // If the contract expects a raw signature, this might need adjustment, 
    // but typically dApps use signMessage for user attestation.
    const signedEK = await signer.signMessage(getBytes(pubKeyHash));
    console.log("Public Key signed.");

    // 3. Contract Interaction
    const accountOnboardContract = new Contract(
        ONBOARD_CONTRACT_ADDRESS,
        JSON.stringify(ONBOARD_CONTRACT_ABI),
        signer
    );

    console.log("Sending onboardAccount transaction...");
    const tx = await accountOnboardContract.onboardAccount(
        rsaKeyPair.publicKey,
        signedEK,
        { gasLimit: 15000000 }
    );
    
    console.log("Transaction sent. Waiting for confirmation...", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed.");

    // 4. Parse Logs
    let parsedLog = null;
    if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
            try {
                const parsed = accountOnboardContract.interface.parseLog(log);
                if (parsed && parsed.name === 'AccountOnboarded') {
                    parsedLog = parsed;
                    break;
                }
            } catch (e) {
                // Ignore logs that don't match the interface
            }
        }
    }

    if (!parsedLog) {
        throw new Error("Could not find AccountOnboarded event in transaction logs.");
    }

    // 5. Recover User Key
    // substring(2) removes the '0x' prefix if present, as expected by the SDK/example logic.
    const userKey = recoverUserKey(
        rsaKeyPair.privateKey,
        parsedLog.args.userKey1.substring(2),
        parsedLog.args.userKey2.substring(2)
    );

    console.log("User Key recovered successfully.");

    return {
        rsaKeyPair,
        userKey
    };
};