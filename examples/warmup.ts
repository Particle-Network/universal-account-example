import { config } from 'dotenv';
import { CHAIN_ID, UniversalAccount, UNIVERSAL_ACCOUNT_VERSION } from '@particle-network/universal-account-sdk';
import { Wallet } from 'ethers';

config();

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY || '');
    const universalAccount = new UniversalAccount({
        projectId: process.env.PROJECT_ID || '',
        projectClientKey: process.env.PROJECT_CLIENT_KEY || '',
        projectAppUuid: process.env.PROJECT_APP_UUID || '',
        smartAccountOptions: {
            name: 'UNIVERSAL',
            version: process.env.UNIVERSAL_ACCOUNT_VERSION || UNIVERSAL_ACCOUNT_VERSION,
            ownerAddress: wallet.address,
        },
    });

    const smartAccountOptions = await universalAccount.getSmartAccountOptions();
    console.log('Your UA EVM Address:', smartAccountOptions.smartAccountAddress);
    console.log('Your UA Solana Address:', smartAccountOptions.solanaSmartAccountAddress);

    // PARTI token on BNB Chain
    const partiToken = { chainId: CHAIN_ID.BSC_MAINNET, address: '0x59264f02d301281f3393e1385c0aefd446eb0f00' };

    const result = await universalAccount.getTokenPair(partiToken);

    console.log('get token pair success');

    const transaction = await universalAccount.createBuyTransaction(
        {
            token: partiToken,
            amountInUSD: '0.001',
        },
        {
            tokenPair: {
                address: result.pair.address,
                factory: result.pair.factory,
            },
        },
    );
    console.log('buy transaction', transaction);
})();
