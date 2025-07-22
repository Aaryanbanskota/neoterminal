export class BlockchainTerminal {
  constructor(providerUrl = 'https://mainnet.infura.io/v3/YOUR-API-KEY') {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    this.wallet = null;
  }

  async connectWallet(privateKey) {
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    return this.wallet.getAddress();
  }

  async monitorTransactions(address) {
    this.provider.on(address, (tx) => {
      Terminal.output(`New TX: ${tx.hash}`);
      Terminal.output(`Block: ${tx.blockNumber} | Value: ${ethers.utils.formatEther(tx.value)} ETH`);
    });
  }

  async deployContract(abi, bytecode, args = []) {
    const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
    const contract = await factory.deploy(...args);
    await contract.deployed();
    return contract.address;
  }
}