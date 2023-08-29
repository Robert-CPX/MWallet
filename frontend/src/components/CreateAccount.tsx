import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

interface CreateAccountProps {
  // setWallet: (wallet: string) => void;
  // setSeedPhrase: (seedPhrase: string) => void;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  setSeedPhrase: React.Dispatch<React.SetStateAction<string>>;
}

const CreateAccount = ({setWallet, setSeedPhrase}: CreateAccountProps) => {
  const [newSeedPhrase, setNewSeedPhrase] = useState("");

  const navigate = useNavigate();

  const generateWallet = () => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase ?? "";
    setNewSeedPhrase(mnemonic);
  }

  const setWalletAndMnemonic = () => {
    setSeedPhrase(newSeedPhrase)
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address)
  }

  return (
    <main className='flex flex-col mx-4 gap-3'>
      <div className='mnemonic'>
        <ExclamationCircleOutlined className='text-sm' />
        <div>Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.</div>
      </div>
      <Button
        className='primary_btn'
        onClick={() => generateWallet()}
      >
        Generate Seed Phrase
      </Button>
      <Card
        className='p-2 min-h-[160px] mt-4'
      >
        {newSeedPhrase && <pre style={{whiteSpace: "pre-wrap"}}>{newSeedPhrase}</pre>}
      </Card>
      <Button 
        className='secondary_btn'
        onClick={() => setWalletAndMnemonic()}
      >
        Open Your New Wallet
      </Button>
      <Button 
        className='mt-14 secondary_btn'
        onClick={() => navigate('/')}
      >
        Back Home
      </Button>
    </main>
  )
}

export default CreateAccount;
