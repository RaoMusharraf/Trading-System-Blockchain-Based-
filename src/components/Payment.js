import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, createBox } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
const { ethers } = require("ethers");

const Payment = (props) => {

    const frensContract = "0xFA30f8e110465056af8D2C3cF30b757ae061e9a2";
    const auctionContract = "0x1F57B1248f4914E3f3dCA35F49498803268aCa44";

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [nftAddress, setNftAddress] = useState("");
    const [nftId, setNftId] = useState("");
    const [bid, setBid] = useState("");
    const [eDate, setEdate] = useState("");
    const [count, setCount] = useState("");
    const [approve, setApprove] = useState("");

    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status);

        addWalletListener();
    }, []);

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const onList = async (nftAddress, nftId, bid, eDate) => {
        if (nftId == '' || nftAddress == '' || bid == '' || eDate == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {
            // const id = nftId.substring(10);
            const end_time = Math.floor(new Date(eDate).getTime() / 1000);
            // const ini_bid = initialBid;

            //Contract Interaction
            const web3 = new Web3(window.ethereum);
            const auction_contractABI = require('../abi/abi_tender.json');
            const price = ethers.utils.parseEther(bid);

            try {
                window.contract = await new web3.eth.Contract(auction_contractABI, auctionContract);
                //set up your Ethereum transaction
                const transactionParameters = {
                    to: auctionContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.createAuction(nftAddress, frensContract, nftId, price, end_time).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                setStatus("✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" + txHash);
                await timeout(5000);
                window.location.reload(false);
            } catch (err) {
                console.log(err);
                setStatus("😢 Something went wrong while listing your NFT for auction");
            }

            // setNftAddress("");
            // setNftId("");
            // setBid("");
            // setEdate("");
            // setApprove("");
        }
    }

    const onApprove = async (nftAddress, nftId) => {
        //Contract Interaction
        const web3 = new Web3(window.ethereum);
        const contractABI = require('../abi/abi_vender.json');

        try {
            window.contract = await new web3.eth.Contract(contractABI, nftAddress);
            //set up your Ethereum transaction
            const transactionParameters = {
                to: nftAddress, // Required except during contract publications.
                from: window.ethereum.selectedAddress, // must match user's active address.
                'data': window.contract.methods.approve(auctionContract, nftId).encodeABI()//make call to NFT smart contract
            };
            //sign the transaction via Metamask
            const txHash = await window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
            await timeout(10000);
            setApprove("done");
            // setStatus("✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash);
        } catch (err) {
            console.log(err);
        }
    };

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
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
        <div className="container">
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

            <h1 style={{ textAlign: 'left' }}>
                Payment Process </h1>
            <form>
                <h2>Address</h2>
                <input
                    type="text"
                    placeholder="Enter Address"
                    onChange={(event) => setNftAddress(event.target.value)} />
                <h2>Amount</h2>
                <input
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(event) => setBid(event.target.value)} />
            </form>
            <br />
            {approve == "" ?
                <button id="approve" onClick={() => onApprove(nftAddress, nftId)}>
                    Approve
                </button>
                :
                <button id="list" onClick={() => onList(nftAddress, nftId, bid, eDate)}>
                    List
                </button>
            }
            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default Payment;