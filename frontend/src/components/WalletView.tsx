import { Button, Divider, Tooltip } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

interface WalletViewProps {
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  seedPhrase: string;
  setSeedPhrase: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
}

const WalletView = ({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}: WalletViewProps) => {
  const navigate = useNavigate();

  const logout = () => {
    setSeedPhrase("")
    setWallet("")
    navigate("/")
  }

  return (
    <main className='flex flex-col mx-4 gap-3'>
      <Button
        className='secondary_btn'
        onClick={logout}
      >
        Logout
      </Button>
      <Tooltip title={wallet}>
        <div>
          {wallet}
        </div>
      </Tooltip>
      <Divider />
    </main>
  )
}

export default WalletView
