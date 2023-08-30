import { Avatar, Button, Divider, List, Spin, Tabs, Tooltip, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/noImg.png";

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
                <List.Item>
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
                <>
                  {nft && (
                    <img
                      key={index}
                      className="h-[240px] w-[240px] object-cover mb-2 rounded-lg"
                      alt="nftImage"
                      src={nft}
                    />
                  )}
                </>
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
        <div>{balance}</div>
      )
    }

  ]

  const logout = () => {
    setSeedPhrase("");
    setWallet("");
    setNFTs(null);
    setTokens(null);
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
    <main className='flex flex-col w-full h-full relative'>
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
      {fetching ? (
        <Spin />
      ):(
        <div>
          <Tabs defaultActiveKey='1' items={items} className='w-full h-full p-2 overflow-y-auto' />
        </div>
      )}
    </main>
  )
}

export default WalletView
