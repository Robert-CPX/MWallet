import { Avatar, Button, Divider, List, Spin, Tabs, Tooltip, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/noImg.png";
import { CHAINS_CONFIG } from '../constants/chains';
import { ethers } from 'ethers';

interface WalletViewProps {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  seedPhrase: string;
  setSeedPhrase: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
}

interface TokenProps {
  token_address: string;
  symbol: string;
  name: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
}

const WalletView = ({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}: WalletViewProps) => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [tokens, setTokens] = useState<[TokenProps] | undefined>(undefined);
  const [nfts, setNFTs] = useState([""]);
  const [balance, setBalance] = useState(0);
  const [sendToAddress, setSendToAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState("");

  const items = [
    {
      key: "3",
      label: 'Tokens',
      children: (
        <>
          {tokens ? (
            <List 
              bordered
              itemLayout='horizontal'
              dataSource={tokens}
              renderItem={(item) => (
                <List.Item className='text-center'>
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo || logo} />}
                    title={item.symbol}
                    description={item.name}
                  />
                  <div>
                    {(
                      parseInt(item.balance) / 10 ** item.decimals
                    ).toFixed(2)}{" "}
                  </div>
                </List.Item>
              )}
            />
          ):(
            <span>You seem to not have any tokens yet</span>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: 'NFTs',
      children: (
        <>
        {nfts ? (
          <>
            {nfts.map((nft,index) => {
              return (
                <React.Fragment key={index}>
                  {nft && (
                    <img
                      className="h-[240px] w-[240px] object-cover mb-2 rounded-lg"
                      alt="nftImage"
                      src={nft}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </>
        ):(
          <span>Your seem to not have any NFTs yet</span>
        )}
        </>
      )
    },
    {
      key: "1",
      label: 'Transfer',
      children: (
        <>
          <h3>Native Balance</h3>
          <h2>{balance.toFixed(2)} {CHAINS_CONFIG[selectedChain].ticker}</h2>
          <div className='mt-8 flex gap-2 items-center'>
            <p className='w-[90px] text-left'>To:</p>
            <Input
              value={sendToAddress} 
              onChange={(e) => setSendToAddress(e.target.value)}
              placeholder='0x...'
            />
          </div>
          <div className='mt-2 flex gap-2 items-center'>
            <p className='w-[90px] text-left'>Amount:</p>
            <Input
              value={amountToSend}
              placeholder='Native token you wish to send'
              onChange={(e) => setAmountToSend(e.target.value)}
            />
          </div>
          <Button
            className='primary_btn mt-8 w-full'
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
          >
            Send Tokens
          </Button>
          {processing && (
            <>
              <Spin />
              {hash && (
                <Tooltip title={hash}>
                  <p>Hover For Tx Hash</p>
                </Tooltip>
              )}
            </>
          )}
        </>
      )
    }

  ]

  const logout = () => {
    setSeedPhrase("");
    setWallet("");
    setNFTs([]);
    setTokens(undefined);
    setBalance(0);
    navigate("/");
  }

  const getAccountTokens = async () => {
    setFetching(true);
    const res = await axios.get(`http://localhost:3002/getTokens`, {
      params: {
        address: wallet,
        chain: selectedChain,
      }
    });
    const response = res.data;

    if (response.tokens.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts.length > 0) {
      setNFTs(response.nfts);
    }

    setBalance(response.balance);

    setFetching(false);
  }

  const sendTransaction = async (to: string, amount: string) => {
    setProcessing(true);
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      to,
      value: ethers.parseEther(amount)
    }
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash("");
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");

      if (receipt?.status === 1) {
        getAccountTokens();
      } else {
        console.log("failed");
      }
    } catch(err) {
      setHash("");
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");
    }
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNFTs([""]);
    setTokens(undefined);
    setBalance(0);
    getAccountTokens();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setNFTs([""]);
    setTokens(undefined);
    setBalance(0);
    getAccountTokens();
  }, [selectedChain]);

  return (
    <main className='flex flex-col w-full h-full relative overflow-y-auto justify-start text-center'>
      <Button
        className='logout_btn absolute right-2 top-2'
        onClick={logout}
      >
        Logout
      </Button>
      <h4 className='font-bold'>Wallet</h4>
      <Tooltip title={wallet}>
        <p className='text-sm'>{wallet.slice(0,4)}...{wallet.slice(38)}</p>
      </Tooltip>
      <Divider />
      {!fetching ? (
        <Spin />
      ):(
        <Tabs defaultActiveKey='1' centered items={items} className='w-full h-full p-2 overflow-y-auto' />
      )}
    </main>
  )
}

export default WalletView
