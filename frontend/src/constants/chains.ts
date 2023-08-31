interface ChainProps {
  hex: string;
  name: string;
  rpcUrl: string;
  ticker: string;
}

const Ethereum: ChainProps = {
  hex: '0x1',
  name: 'Ethereum',
  rpcUrl: '',
  ticker: "ETH"
};

const MumbaiTestnet: ChainProps = {
  hex: '0x13881',
  name: 'Mumbai Testnet',
  rpcUrl: '',
  ticker: "MATIC"
};

export const CHAINS_CONFIG: {[key: string] : ChainProps} = {
  "0x1": Ethereum,
  "0x13881": MumbaiTestnet,
};