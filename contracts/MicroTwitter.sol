// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
contract MicroTwitter {
    uint256 totalTweet;
    uint256 private seed;
    constructor() payable{
        console.log("Hi from contract console");
        seed = (block.timestamp + block.difficulty) % 100;

    }
    // Unlike any other evnts 
    event NewTweet(address indexed from, uint256 timestamp,string message);
    // Struct wave
    struct Tweet{
        address twitters_address;
        string tweet;
        uint256 timestamp;
    }
    // Decalare variable tweets from new struct Tweet
    Tweet[] tweets;
       /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user twitted at us.
     * just to avoid spam tweets as this is blockchain
     */
    mapping(address => uint256) public lastTweetAt;
    

    /*
    This tweet function stores the tweet into the variables tweets
    */
    function tweet(string memory _message) public{
         require(
            lastTweetAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        lastTweetAt[msg.sender] = block.timestamp;
        totalTweet+=1;
        console.log("%s has twitted!", msg.sender);
        tweets.push(Tweet(msg.sender,_message,block.timestamp));
        console.log("Random number! %d", seed);
         emit NewTweet(msg.sender, block.timestamp, _message);
       
    }
    // get all waves
    function getAllTweets() public view returns(Tweet[] memory){
        return tweets;
    }
    // kind of a get request
    function getTotalTweets() public view returns(uint256){
        console.log("We have %d total tweets",totalTweet);
        return totalTweet;
    }
    
}