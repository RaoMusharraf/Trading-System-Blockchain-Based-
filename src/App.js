import './App.css';
import CreateTender from './components/CreateTender';
import SeeVender from './components/SeeVender';
import SeeTender from './components/SeeTender';
import AllItems from './components/AllItems';
import CreateVender from './components/VenderRequest';
// import Feedback from './components/Feedback';
// import Payment from './components/Payment';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Routes, useRouteLoaderData } from "react-router-dom";
import logo from './lilfrens-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
// import AllRequests from './components/Allrequests';
import { connectWallet, getCurrentWalletConnected } from "./utils/interact";
import { useEffect, useState } from 'react';



function App() {
  const [Tokentime, setTokentime] = useState({})
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [auctionDetails, setAuctionDetails] = useState([]);
  const [timer, setmushi] = useState("")

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          window.location.reload()
          //setStatus("👆🏽 Write a message in the text-field above.");
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
  }
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);
  return (

    <>

      <div class="topnav">
        <div>
          <h1 id="title" style={{ textAlign: 'center' }}>
            <a href="/">
              <img src={logo} alt="Logo" /></a> </h1>
        </div>
        <div className='my-navigation'>
          <NavLink to="/create-tender">Create Tender</NavLink>
          <NavLink to="/see-tender">See Tender</NavLink>
          <NavLink to="/">All Tenders</NavLink>
          <NavLink to="/bundle_auction">Vender Requests</NavLink>
          <NavLink to="/Vender_request">Create Vender</NavLink>
          <button id="walletButton" onClick={connectWalletPressed}>
            {walletAddress.length > 0 ? (
              "Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>

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
