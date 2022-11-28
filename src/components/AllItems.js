import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
const { ethers } = require("ethers");

const AllItems = (props) => {

    const auctionContract = "0x4fe9dA53B6BbD9C7a3755449a3d1BaadAacfD049";

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [bid, setBid] = useState([]);

    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status);

        getData();

        addWalletListener();
    }, []);

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };
    const getData = async () => {

        const web3 = new Web3(window.ethereum);
        
        const contractAuctionABI = require('../abi/abi_tender.json');
        var auctionData = [];

        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);

            const all_single = await window.contract.methods.AllTender().call();
            console.log(all_single.length,"total");

            var auctionData = [];

            for (var i = 0; i < all_single.length; i++) {
                const auc_data = {
                    "name": all_single[i].name,
                    "quantity": all_single[i].quantity,
                    "budget": all_single[i].budget,
                    "hours": all_single[i].time,
                    "description": all_single[i].description,
                    "Owner": all_single[i].Owner,
                }
                auctionData.push(auc_data);
            }
            console.log(auctionData)

            //setAuctionDetails(auctionData);
        } catch (err) {
            console.log(err);
        }
    };

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
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

    return (
        <div className="Minter">
            <br />
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
            <br></br>
            <h1 id="title" style={{ textAlign: 'center' }}>
                <img src={logo} alt="Logo" /> </h1>
            <h1 style={{ textAlign: 'center' }}>Your Requests </h1>
            <table class="table table-striped mtable">
                <thead>
                    <tr>
                        <th scope="col">Token-Id</th>
                        <th scope="col">Tenders</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody id="tenders">
                </tbody>
            </table>
            <div class="row">
                {auctionDetails.length > 0
                    ? auctionDetails.map((item, index) => {
                        return (
                            <div class="column">
                                <div class="card">
                                    <img src={item.image} alt={item.image} style={{ width: '100%' }} />
                                    <div class="container">
                                        <h4><b>{item.name}</b></h4>
                                        <p>{item.description}</p>
                                        <p>Token ID: {item.currentBidOwner.substring(0, 5)}........{item.currentBidOwner.substring(35)}</p>
                                        <p>Price: {parseInt(ethers.utils.formatEther(item.currentBidPrice))}</p>
                                        <p>Request Completing Date: <Countdown
                                            onComplete={() =>
                                                window.location.reload(false)
                                            }
                                            date={
                                                new Date(parseInt(item.endAuction) * 1000)
                                            }
                                        /></p>
                                        <input
                                            type="text"
                                            placeholder="Enter Price In PKR"
                                            onChange={(event) => setBid(event.target.value)} />
                                        <br />
                                        <br />
                                        {approve == "" ?
                                            <button id="approve" onClick={() => onApprove(bid)}>
                                                Approve
                                            </button>
                                            :
                                            <button id="bidPrice" onClick={() => bidPrice(item.index, bid)}>
                                                Set Bid
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div></div>
                }
            </div>
            <br />
            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default AllItems;