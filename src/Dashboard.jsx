import React from "react";
import { useState, useEffect, useRef } from "react";
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import "./Dashboard.css";
import axios from 'axios';

import child2 from "./assets/child2.png";
import busd from "./assets/busd.png";
import Web3 from "web3";


const Dashboard = () => {

  const [ethereum, setEthereum] = useState(window.ethereum);
  const [account, setAccount] = useState('');
  const web3 = new Web3(window.ethereum);
  const contractAddress = '0xb62C3D54FE046c811339bFE618999015E4A36285';
  const contractABI = [{
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
  ];

  const Contract = new web3.eth.Contract(
    contractABI,
    contractAddress
  );
  const providerRef = useRef(null);
  const contractRef = useRef(null);

  const [burnBalance, setBurnBalance] = useState(0);
  const [donationBalance, setDonationBalance] = useState("Loading...");
 const [totalSupply, setTotalSupply] = useState();
 const [price, setPrice] = useState();
 const [volume, setVolume] = useState();

  //   const init = async () => {
  //     const provider = await detectEthereumProvider();
  //     if (provider) {
  //       console.log('MetaMask is installed!');
  //       setEthereum(provider);
  //       providerRef.current = new ethers.providers.Web3Provider(provider);
  //       const signer = providerRef.current.getSigner();
  //       contractRef.current = new ethers.Contract(contractAddress, contractABI, signer);
  //       provider.on('accountsChanged', (accounts) => {
  //         if (ethereum.isConnected()) {
  //           const truncatedAccount = accounts.length > 0 ? `${accounts[0].substr(0, 5)}...${accounts[0].substr(-3)}` : '';
  //           setAccount(truncatedAccount);
  //           localStorage.setItem('account', truncatedAccount);
  //         } else {
  //           setAccount('');
  //           localStorage.removeItem('account');
  //         }
  //       });
  //     } else {
  //       console.log('Please install MetaMask!');
  //     }
  //   };
  //   init();

  // const storedAccount = localStorage.getItem('account');
  //   if (storedAccount) {
  //     setAccount(storedAccount);
  //   }
  // }, [ethereum, contractAddress, contractABI]);

  const connectWallet = async () => {
    if (ethereum && ethereum.isConnected()) {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const truncatedAccount = `${accounts[0].substr(0, 5)}...${accounts[0].substr(-3)}`;
      setAccount(truncatedAccount);
      localStorage.setItem('account', truncatedAccount);
    } else {
      console.log('MetaMask is not connected!');
    }
  };

  function getContractBalance(contractAddress) {
    let balance; // Define balance variable here
    
    web3.eth.getBalance(contractAddress, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        balance = web3.utils.fromWei(result, 'ether');
        setDonationBalance(result / 10**10)
     
      }
    });
    
    // Return balance outside of callback function
    return balance;
  }
  
  // Example usage:
  const balance = getContractBalance('0xb62C3D54FE046c811339bFE618999015E4A36285');
  console.log('Balance:', balance);
  
  const API_KEY = 'fa56cda0-ee13-4caf-957d-a23036a55c3b';
  const LIVECOINWATCH_API_URL = 'https://api.livecoinwatch.com/coins/single';
  
  // Function to get Child Support token price
  async function getChildSupportPrice() {
    try {
      const response = await fetch(new Request(LIVECOINWATCH_API_URL), {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": API_KEY,
        }),
        body: JSON.stringify({
          currency: "USD",
          code: "___CS",
          meta: true,
        }),
      });
  
      const data = await response.json();
      const chsPrice = data.rate;
      setTotalSupply(data.totalSupply)
      setPrice(data.rate)
      setVolume(data.volume)
  
      console.log(`Child Support price: ${chsPrice} USD`);

    } catch (error) {
      console.error(error);
    }
  }
  
  getChildSupportPrice();
 

  const ethereumButton = (
    <button className="connectToMetamask" onClick={connectWallet}>
      {account ? account : 'Connect Wallet'}
    </button>
  );



  return (
    <>
      <div className="dashboard elementor-container elementor-column-gap-wide">
        <div className="dashboard-row1">
          <div className="dashboard-row1-col2">
            <img
              src={child2}
              alt="child support logo"
              className="dashboard-row1-col2-img"
            />
            <h2>
              CHILD SUPPPORT REWARD <br />
              <span> DASHBOARD</span>
            </h2>
          </div>
          <div className="dashboard-row1-col1">
            <div className="App"> {ethereumButton} </div>
          </div>
        </div>

        <div className="dashboard-row2">
          <button className="dashboard-row2-btn">
            <i class="fa-solid fa-arrow-left"></i> Return Home
          </button>
          <div className="dashboard-row1-input">
            <input type="text" placeholder="Enter Wallet Address" />
            <button>Search</button>
          </div>
        </div>

        <div className="dashboard-row3">
          <div className="dashboard-row3-col1">
            <img
              src={child2}
              alt="child support logo"
              className="dashboard-row3-col1-img"
            />
          </div>

          <div className="dashboard-row3-col2">
            <div>
              Token Name: <b>Child Support</b>
            </div>
            <div>
              Symbol: <b> CS </b>
            </div>
            <div>
              ToTal Supply: <b>21,000,000,000</b>
            </div>
            <div>
              Circulating Supply: <b>21,000,000,000</b>
            </div>
            <div>
              Total BNB in Pool: <b>Loading ...</b>
            </div>
            <div>
              Child Support Contract:{" "}
              <b>0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c</b>
            </div>
            <div>
              Donation wallet Address: <b>0xb62c3d54fe046c811339bfe618999015e4a36285</b>
            </div>
            <div>
              Burn Wallet Address: <b>0x000000000000000000000000000000000000dead</b>
            </div>
            <div className="dashboard-row3-col2-div1">BALANCE</div>
            <h2>
            <span>CS / WBNB</span>
            </h2>
          </div>
        </div>

    
        <div className="dashboard-row5">
          <div className="dashboard-row5-col1">
            <div>Burn Wallet Balances</div>
            {burnBalance}
          </div>
          <div className="dashboard-row5-col2">
            <div>Donation Wallet Balances</div>
            {donationBalance}
          </div>
        </div>
        <div className="dashboard-row5">
          <div className="dashboard-row5-col1">
            <div>Current Price (USD)</div>
            <h2>${price}</h2>
          </div>
          <div className="dashboard-row5-col2">
            <div>Market Cap</div>
            <h2>$1,767,339</h2>
          </div>
        </div>

        

        <div className="dashboard-row8">
          <h2>RECENT TRANSACTIONS (EXPERIMENTAL)</h2>
          <div className="dashboard-row8-col1">
            <div>Hash</div>
            <div className="dashboard-row8-col1-row1">
              <div>$CS</div>
              <div>WBNB(USD)</div>
              <div>MODE</div>
            </div>
          </div>
          <hr />
          <h3>PLEASE LOGIN TO SHOW RECENT TRASACTION HISTORY</h3>
        </div>

        <div className="dashboard-row9">
          <a href="https://child.support/">
            <i class="fa-solid fa-house"></i> Child Support Home
          </a>
          <a href="#">
            <i class="fa-brands fa-telegram"></i> Telegram
          </a>
          <a href="https://bscscan.com/address/0x502b8136c48977b975a6c62b08ac4e15dabc8172#code">
            <i class="fa-solid fa-magnifying-glass"></i> BSC Scan
          </a>
          <a href="https://pancakeswap.finance/swap?chain=bsc&outputCurrency=0x55d398326f99059fF775485246999027B3197955&inputCurrency=0x502B8136c48977b975a6C62B08Ac4E15Dabc8172">
            <i class="fa-solid fa-chart-column"></i> DEXTOOLS
          </a>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
















