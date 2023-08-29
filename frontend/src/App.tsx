import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/global.css'
import React from 'react'
import Assets from './assets'

import { Select } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { CreateAccount, Home, RecoverAccount, WalletView } from './components'

const App = () => {
  const [wallet, setWallet] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <div className='main-container'>
      <header>
        <img src={Assets.mlogo} className="h-[60%] ml-2" alt="logo" />
        <Select
          onChange={(chain) => setSelectedChain(chain)}
          className='min-w-[140px] mr-2'
          value={selectedChain}
          options={[
            {
              label: "Ethereum",
              value: "0x1",
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881",
            },
            {
              label: "Polygon",
              value: "0x89",
            },
            {
              label: "Avalanche",
              value: "0xa86a",
            },
          ]}
        />
      </header>
      {wallet && seedPhrase ? (
        <Routes>
          <Route
            path="wallet"
            element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
          }
        />
        </Routes>
      ):(
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<CreateAccount setWallet={setWallet} setSeedPhrase={setSeedPhrase}/>} />
          <Route
            path="/recover"
            element={
              <RecoverAccount
                setWallet={setWallet}
                setSeedPhrase={setSeedPhrase}
              />
            }
          />
        </Routes>
      )}
    </div>
  )
}

export default App
