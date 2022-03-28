
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const MicroTwitterFactory = await hre.ethers.getContractFactory('MicroTwitter');
  // Fund our contract with some ether
  const MicroTwitter = await MicroTwitterFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await MicroTwitter.deployed();
  console.log("contract deployed", MicroTwitter.address);
  console.log("Contract deployed by:", owner.address);
  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    MicroTwitter.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let twCount;
  twCount = await MicroTwitter.getTotalTweets();

  // Self transaction
  let twtTxn = await MicroTwitter.tweet('This is tweet #1');
  await twtTxn.wait();
  contractBalance = await hre.ethers.provider.getBalance(
    MicroTwitter.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  twCount = await MicroTwitter.getTotalTweets();
  // Random person transaction
  twtTxn = await MicroTwitter.connect(randomPerson).tweet('This is tweet #2');
  await twtTxn.wait();
  contractBalance = await hre.ethers.provider.getBalance(
    MicroTwitter.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  twCount = await MicroTwitter.getTotalTweets();

  let alltwts = await MicroTwitter.getAllTweets();
  console.log(alltwts);
}
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();