import express, { Request, Response } from "express";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config()

const port = 3002;

app.get("/getTokens", async (req: Request, res: Response) => {
  const address: string = req.query.address as string;
  const chain:string = req.query.chain as string;
  
  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain,
    address,
  });

  const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
    chain,
    address,
    mediaItems: true,
  });

  const myNFTs = nfts.raw.result?.map((nft, index) => {
    if (nft?.media?.media_collection?.high?.url && nft?.possible_spam && (nft?.media?.category !== "video")) {
      return nft["media"]["media_collection"]["high"]["url"];
    }
  });

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain,
    address,
  });

  const jsonResponse = {
    tokens: tokens.raw,
    nfts: myNFTs,
    balance: parseInt(balance.raw.balance) / (10 ** 18)
  }

  return res.status(200).json(jsonResponse);
});

const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
    logLevel: "verbose",
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

startServer();