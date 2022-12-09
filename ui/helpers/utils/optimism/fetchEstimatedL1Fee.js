import buildUnserializedTransaction from './buildUnserializedTransaction';

// The code in this file is largely drawn from https://community.optimism.io/docs/developers/l2/new-fees.html#for-frontend-and-wallet-developers

import buildUnserializedTransaction from './buildUnserializedTransaction';

const ORACLE_ADDRESS = '0x420000000000000000000000000000000000000F';

// Snippet of the ABI that we need 
// Should we need more of it at some point, the full ABI can be found here:
// https://github.com/ethereum-optimism/optimism/blob/develop/gas-oracle/abis/OVM_GasPriceOracle.json
const ORACLE_ABI = [
  {
    inputs: [{ internalType: 'bytes', name: '_data', type: 'bytes' }],
    name: 'getL1Fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export default async function fetchEstimatedL1Fee(eth, txMeta) {
  const contract = eth.contract(ORACLE_ABI).at(ORACLE_ADDRESS);
  const serializedTransaction =
    buildUnserializedTransaction(txMeta).serialize();
  const result = await contract.getL1Fee(serializedTransaction);
  return result?.[0]?.toString(16);
}