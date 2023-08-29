import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { BulbOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Button } from 'antd';

interface RecoverAccountProps {
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  setSeedPhrase: React.Dispatch<React.SetStateAction<string>>;
}

const RecoverAccount = ({setWallet, setSeedPhrase}: RecoverAccountProps) => {
  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);
  const navigate = useNavigate();
  
  const userTypedSeed = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNonValid(false);
    setTypedSeed(e.target.value);
  }

  const recoverWallet = () => {
    let recoverWallet;
    try {
      recoverWallet = ethers.Wallet.fromPhrase(typedSeed);
    } catch(err) {
      setNonValid(true);
      return;
    }
    setSeedPhrase(typedSeed);
    setWallet(recoverWallet.address)
    navigate('/wallet');
  }

  return (
    <main className='flex flex-col gap-3 mx-4'>
      <div className='mnemonic'>
        <BulbOutlined style={{fontSize: "20px"}} />
        <p>Type your seed phrase in the field below to recover your wallet (it
            should include 12 words seperated with spaces)</p>
      </div>
      <TextArea
        value={typedSeed}
        rows={5}
        placeholder='Type your seed phrase here...'
        onChange={userTypedSeed}
      />
      <Button
        className='primary_btn'
        disabled={typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "}
        onClick={recoverWallet}
      >
        Recover Wallet
      </Button>
      {nonValid && <p className='error'>Invalid seed phrase</p>}
      <Button
        className='secondary_btn mt-16'
        onClick={() => navigate('/')}
      >
        Back Home
      </Button>
    </main>
  )
}

export default RecoverAccount