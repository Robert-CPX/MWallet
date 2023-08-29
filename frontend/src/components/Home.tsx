import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <main className='flex flex-col flex-auto'>
        <h2> Welcome to MWallet 🤗</h2>
        <h4>A web3 wallet</h4>
        <Button
          className='mt-28 primary_btn'
          onClick={() => navigate("/wallet")}
        >
          Create A Wallet
        </Button>
        <Button
          className='mt-3 secondary_btn'
          type='default'
          onClick={() => navigate("/recover")}
        >
          Sign In With Seed Phrase
        </Button>
      </main>
      <footer>
        <p className='text-xs'>Powered by{" "}
          <a href='https://moralis.io/api/wallet/' target='_blank' rel="noreferrer" className='underline'>Moralis API</a>
        </p>
      </footer>
    </>
  )
}

export default Home