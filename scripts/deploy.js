const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());
    const Tweet = await hre.ethers.getContractFactory('MicroTwitter');
    const portal = await Tweet.deploy({
      });
    await portal.deployed();
    console.log('MicroTwitter address: ', portal.address);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);

    } catch (error) {
        console.error(error)
    }
}
runMain();