
import React, { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import abi from "./utils/MicroTwitter.json";
import './App.css';

const people = [
  {
    name: 'Lindsay Walton',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    role: 'Director, Product Development',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isminting, setIsMinting] = useState(false);
  const [allTweets, setAllTweets] = useState([]);
  const [message, setMessage] = useState('');
  const contractAddress = "0xdd590da022Bb2eF047041C749171ac0AdFf72C03";
  const contractABI = abi.abi;
 
  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    try {


      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        getAllTweets();
      }
      // check if we are authorized
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length != 0) {
        const account = accounts[0]
        console.log("Found authorized account")
        setCurrentAccount(account)
       
      }
      else {
        console.log("No authorized account found")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  // Connect to wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask")
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }
  const tweet = async () => {
    try {
      setIsMinting(true)
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // How to connect to the created contract
        const microTwitterContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Get the count of total tweet
        let count = await microTwitterContract.getTotalTweets();
        console.log("Retrieved total wave count...", count.toNumber());
        // Send the transaction
        const twettxn = await microTwitterContract.tweet(message);

        console.log("Mining", twettxn.hash)
        // Wait for the transaction to complete
        await twettxn.wait();
        console.log("Minted--", twettxn.hash)
        setIsMinting(false)
        count = await microTwitterContract.getTotalTweets();
        console.log("Retrieved total wave count...", count.toNumber());
        getAllTweets()
      }
      else {
        console.log("Ethereum object doesn't exist!");
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  // Get all tweets
  const  getAllTweets = async () => {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner()
      const tweetContract = new ethers.Contract(contractAddress, contractABI, signer);
      const tweets = await tweetContract.getAllTweets();
      let tweetsCleaned = [];
      tweets.forEach(twt => {
        tweetsCleaned.push({
          twitters_address: twt.twitters_address,
          timestamp: new Date(twt.timestamp * 1000),
          tweet: twt.tweet
        });
      });
      
      setAllTweets(tweetsCleaned);
    }
  }
  /*
  * This runs our function when the page loads.
  */ const handleChange = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    let twitterContract;
    const onNewTweet = (from, timestamp, message) => {
      console.log('NewTweet', from, timestamp, message);
      setAllTweets(prevState => [
        ...prevState,
        {
          twitters_address: from,
          timestamp: new Date(timestamp * 1000),
          tweet: message,
        },
      ]);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      twitterContract = new ethers.Contract(contractAddress, contractABI, signer);
      twitterContract.on('NewTweet', onNewTweet);
    }
 
    checkIfWalletIsConnected();
    return () => {
      console.log('exiting')
      if (twitterContract) {
        twitterContract.off('NewTweet', onNewTweet);
      }
    };
  }, [])


  return (
    <div className="max-w-lg mx-auto">
      <div>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Micro Twitter on Blockchain</h2>
         
        </div>
        <form action="#" className="mt-6 flex">
        
          <input
            type="text"
            name="text"
            id="text"
            value={message}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter Your Tweet"
          />
          {/* <button
            type="submit"
            className="ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tweet
          </button> */}
    {!currentAccount &&   <a href="#_" onClick={connectWallet} className="px-2 py-1.5 w-40 relative rounded group font-medium text-xs text-white font-medium inline-block">
    <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
    <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
    <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
    <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
    <span className="relative">Connect Wallet </span>
</a>}
{currentAccount && <a href="#_" onClick={tweet} className="relative inline-flex items-center justify-center text-xs inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group">
    <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
    <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
        <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
        <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
    </span>
    <span className="relative text-white">Tweet</span>
</a>}
      
        </form>
      </div>
      <div className="mt-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Recent Tweets by all ❤️ 🌅
        </h3>
        <ul role="list" className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
          {allTweets.map((tweet, Idx) => (
            <li key={Idx} className="py-4 flex items-center justify-between space-x-3">
              <div className="min-w-0 flex-1 flex items-center space-x-3">
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{tweet.tweet}</p>
                  <p className="text-sm font-medium text-gray-500 truncate">{tweet.timestamp.toString().slice(0,25)}</p>
                  <p className="text-sm font-medium text-gray-500 truncate">{tweet.twitters_address}</p>

                </div>
              </div>
   
            </li>
          ))}
        </ul>
      </div>
      <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
     
        <div className="mt-8 flex flex-col md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">Blockchain is Love ❤️ that makes your day🌅</p>
          <p className="text-center text-base text-gray-400">Hence ❤️ 🌅</p>
        </div>
      </div>
    </footer>
    </div>
    
  )
}
