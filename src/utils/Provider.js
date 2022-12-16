import Web3 from 'web3';

class Provider {
  constructor() {
    this.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
}

export default Provider;