// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const MySecretKey = new Uint8Array(
    [
        246,  97, 154, 107,  89,  75, 179, 212, 175,  21,  99,
   	59,  92, 162,  92, 144, 195, 108, 197, 150,  78, 228,
   	62, 145, 247,  95,  72, 202, 244,   5, 226, 205, 148,
  	133,  82, 144, 234, 198, 117,  32,  23,   0,  93,  27,
   	89,   2,  94,  19, 240, 247,  47,   6, 217, 123, 201,
  	126,  97,  40, 207,  74, 227, 105, 121, 104
      ]            
);

var fromWallet = Keypair.fromSecretKey(MySecretKey)
const toWallet = Keypair.generate();

  // Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const walletFromBalance = await connection.getBalance(
            new PublicKey(fromWallet.publicKey)
        );
	    const walletToBalance = await connection.getBalance(
            new PublicKey(toWallet.publicKey)
        );
        console.log(`Wallet balance from "FROM": ${parseInt(walletFromBalance) / LAMPORTS_PER_SOL} SOL`);
	    console.log(`Wallet balance from "TO": ${parseInt(walletToBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const transferSol = async() => {
   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	console.log("Transfering SOL ...please wait...")
		
   const FromBalance = await connection.getBalance(
            new PublicKey(fromWallet.publicKey)
            );
   const sendToken = Math.round(FromBalance / 2);
 
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toWallet.publicKey,
            lamports: sendToken
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
    );
    console.log('Signature is ', signature);
}

const mainFunction = async () => {
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();	
}

mainFunction();