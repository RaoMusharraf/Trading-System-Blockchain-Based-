import './App.css';
import Web3 from "web3";
import Modal from 'react-bootstrap/Modal';
import CreateTender from './components/CreateTender';
import SeeVender from './components/SeeVender';
import SeeTender from './components/SeeTender';
import AllItems from './components/AllItems';
import CreateVender from './components/VenderRequest';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Routes, useRouteLoaderData } from "react-router-dom";
import logo from './lilfrens-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connectWallet, getCurrentWalletConnected } from "./utils/interact";
import { useEffect, useState } from 'react';

function App() {

  const [walletAddress, setWallet] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [SignIns, setSignIn] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [signer, setSigner] = useState(false);
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(false);

  const [transection, setTransection] = useState("");
  const web3 = new Web3(window.ethereum);
  const auctionContract = process.env.REACT_APP_CONTRACT;
  const contractAuctionABI = require('./abi/abi_tender.json');
  window.contract = new web3.eth.Contract(contractAuctionABI, auctionContract);
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);
  };
  const signUp = async (name, email) => {
    if (name == '' || email == '') {
      alert("Please fill all values!!!!!!!!!!!");
    } else {
      // connectWalletPressed();
      try {
        setLoadingState(true);
        const transactionParameters = {
          to: auctionContract, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          'data': window.contract.methods.SignUp(name, email, window.ethereum.selectedAddress).encodeABI()//make call to NFT smart contract
        };
        const txHash = await window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          });
        // setStatus("✅ Check out your transaction on Etherscan .");
        for (let index = 0; index > -1; index++) {
          var receipt = await web3.eth.getTransactionReceipt(txHash)
          if (receipt != null) {
            // setTransec(receipt);
            await window.contract.methods.Signer(window.ethereum.selectedAddress).call().then(res => {
              setSigner(res.Up);
            });
            setTransection(receipt);
            break;
          }
          await timeout(1000);
          console.log("Hello");
        }

      } catch (error) {
        console.log(err);
        setLoadingState(false)
      }
    }
  }

  const mysignersetter = async () => {
    await window.contract.methods.Signer(window.ethereum.selectedAddress).call().then(res => {
      setSigner(res.Up);
      setSignIn(res.InOut);
    })
  }

  useEffect(() => {
    mysignersetter()
    setLoadingState(false)
  }, [signer, SignIns])
  const signIn = async () => {
    // connectWalletPressed();
    try {
      setLoadingState(true);
      // const all_single = await window.contract.methods.SignIn("0x2B8C026e5a69Af0A8e7D670f45f8E16c0362a6d3").call();
      const transactionParameters = {
        to: auctionContract, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.SignIn(window.ethereum.selectedAddress).encodeABI()//make call to NFT smart contract
      };
      const txHash = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
      // setStatus("✅ Check out your transaction on Etherscan .");
      for (let index = 0; index > -1; index++) {
        var receipt = await web3.eth.getTransactionReceipt(txHash)
        if (receipt != null) {
          // setTransec(receipt);
          await window.contract.methods.Signer(window.ethereum.selectedAddress).call().then(res => {
            setSignIn(res.InOut);
          });
          setTransection(receipt);
          break;
        }
        await timeout(1000);
        console.log("Hello");
      }
    } catch (err) {
      console.log(err);
      setLoadingState(false)
    }
  }
  const signOut = async () => {
    // connectWalletPressed();
    try {
      setLoadingState(true);
      const transactionParameters = {
        to: auctionContract, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.SignOut(window.ethereum.selectedAddress).encodeABI()//make call to NFT smart contract
      };
      const txHash = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
      // setStatus("✅ Check out your transaction on Etherscan .");
      for (let index = 0; index > -1; index++) {
        var receipt = await web3.eth.getTransactionReceipt(txHash)
        if (receipt != null) {
          // setTransec(receipt);
          await window.contract.methods.Signer(window.ethereum.selectedAddress).call().then(res => {
            setSignIn(res.InOut);
          });
          setTransection(receipt);
          break;
        }
        await timeout(1000);
        console.log("Hello");
      }
    } catch (err) {
      console.log(err);
      setLoadingState(false)
    }
  }
  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          window.location.reload();
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  };
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
    mysignersetter();
    addWalletListener();
  }, []);
  return (
    <>
      {
        loadingState ? (
          <div className="loader-wrao" style={{ visibility: "visible" }} >
            <div className="loader"></div>
          </div >) : <></>
      }
      <Modal className='signupmodel' show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mysignup-wrap'>
            <label>Name</label>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
            {/* <label>Address</label>
            <input onChange={(e) => setAddress(e.target.value)} placeholder="Address" /> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={() => signUp(name, email)}>
            Sign UP
          </button>
        </Modal.Footer>
      </Modal>
      <div class="topnav">
        <div>
          <h1 id="title" style={{ textAlign: 'center' }}>
            <a href="/">
              <img src={logo} alt="Logo" /></a> </h1>
        </div>
        <div className='my-navigation'>
          <NavLink to="/create-tender">Create Tender</NavLink>
          <NavLink to="/see-tender">See Tender</NavLink>
          <NavLink to="/"> All Tenders</NavLink>
          <NavLink to="/bundle_auction">Vender Requests</NavLink>
          <NavLink to="/Vender_request">Create Vender</NavLink>

          {
            walletAddress.length > 0 ?
              SignIns ?
                <>
                  <button id="walletButton" onClick={signOut}>Log out</button>
                  <p className='myWalletaddress'>USER : {String(walletAddress).substring(0, 7) +
                    "......" +
                    String(walletAddress).substring(36)}</p>
                </>
                : signer ? <button id="walletButton" onClick={signIn}>Sign In</button> :
                  <button id="walletButton" onClick={handleShow}>Sign Up</button> : <button id="walletButton" onClick={connectWalletPressed}>Connect Wallet</button>
          }
        </div>
      </div>
      <Routes>
        <Route path='/' element={<AllItems />}></Route>
        <Route path='/create-tender' element={<CreateTender />}></Route>
        <Route path='/bundle_auction' element={<SeeVender />}></Route>
        <Route path='/see-tender' element={<SeeTender />}></Route>
        <Route path='/Vender_request' element={<CreateVender />}></Route>
      </Routes>
    </>
  );
}

export default App;
