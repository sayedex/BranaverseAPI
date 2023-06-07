import { ethers } from "ethers";
import { wallet } from "./web3provider";
import crypto from "crypto";
import { Contract } from '@ethersproject/contracts';
import { MinterABI } from "../ABI/minter";
import {erc20ABI} from "../ABI/erc20"

export const tokenaddresss = "0x5e6602B762F76d8BFDC7321AA0B787B1E67b187F"

const RPC_URL =
  "https://data-seed-prebsc-1-s2.binance.org:8545";
export const web3client = new ethers.providers.JsonRpcProvider(RPC_URL);

// checks

export function getContract(contractAddress: string) {
   const contract = new ethers.Contract(contractAddress, erc20ABI, web3client);
  return contract;
 }


export async function createSignature(user:string,id:number,amount:number,nonce:number,) {
     
  const data = '0x'; // Replace with any additional data

   const actionMsg = ethers.utils.solidityPack(
    ['address', 'string', 'string'],
    [user, id.toString(), amount.toString()]
  );


  const message = ethers.utils.solidityPack(
   ['address', 'bytes', 'string'],
    [user, actionMsg, nonce.toString()]
 );

  const messageHash =  ethers.utils.solidityKeccak256(["bytes"], [message]);
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
   

 return signature;
}


export function generateNonce(input:string) {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  const numericHash = parseInt(hash, 16);
  const nonce = numericHash % 10000000; // Limit nonce to the range of 0 to 9999999
  return nonce;
}


//hook for Read/write all kind of function for main core contract 
 const getContractInstance = (signer:any) => {
	var contract = new Contract(process.env.MARKET_CONTRACT!, MinterABI, signer);
	return contract;
};


export const ironOptions = {
  cookieName: 'siwe',
  password: process.env.IRON_PASSWORD as string,
  cookieOptions: {
    secure: process.env.IRON_PASSWORD! === 'production',
  },
};


// check signature 

export const verifySignature = async (wallet:string, signature:string,nonce:string) => {
  try {
    // Convert the signature to a format that ethers.js can verify
    const signatureBytes = ethers.utils.arrayify(signature);

    const signer = ethers.utils.verifyMessage(nonce, signatureBytes);

    // Compare the signer address with the provided wallet address
    const isSignatureValid = signer.toLowerCase() === wallet.toLowerCase();

    return isSignatureValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};




// send transation helper 


export const Mint = async(fname: string,args: Array<any>)=>{
  const name = String(fname);
  const myContract = await getContractInstance(wallet);
  const response = await myContract?.[name](
    ...args);
    const receipt = await response.wait();
    console.log(receipt.transactionHash);
    
    return receipt?true:false;
}


