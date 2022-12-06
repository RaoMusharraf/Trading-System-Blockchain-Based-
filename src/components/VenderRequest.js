import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, createBox } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const { ethers } = require("ethers");

const CreateVender = (props) => {

    const [Token, setTokenid] = useState("");
    const [delivery, setDelivey] = useState("");
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [statusLink, setLink] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
    const auctionContract = process.env.REACT_APP_CONTRACT;

    const navigate = useNavigate()
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    //State variables
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

    const onList = async (budget, description, delivery) => {
        if (budget == '' || delivery == '' || description == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {

            //Contract Interaction
            const web3 = new Web3(window.ethereum);
            const auction_contractABI = require('../abi/abi_tender.json');
            try {
                window.contract = await new web3.eth.Contract(auction_contractABI, auctionContract);
                //set up your Ethereum transaction
                const transactionParameters = {
                    to: auctionContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.vender(localStorage.lToken, budget, description, delivery).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });


                await timeout(5000).then(res => {
                    navigate("/")
                });

            } catch (err) {
                console.log(err);
                setStatus("😢 Something went wrong while listing your NFT for auction");
            }
        }
    }
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
    useEffect(() => {
        let temp;
        temp = localStorage.lToken
        setTokenid(temp)
        console.log(localStorage.lToken);

    }, [])

    return (
        <div className="container createtender">
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
                List Request For Items </h1>
            <form>
                <h2>Price</h2>
                <input
                    type="text"
                    placeholder="Enter Price"
                    onChange={(event) => setBudget(event.target.value)} />
                <h2>Delivery</h2>
                <input
                    type="text"
                    placeholder="Enter Days"
                    onChange={(event) => setDelivey(event.target.value)} />
                <h2>Description</h2>
                <input
                    type="text"
                    placeholder="Enter Description"
                    onChange={(event) => setDescription(event.target.value)} />
            </form>
            <br />
            <button id="list" onClick={() => onList(budget, description, delivery)}>
                List
            </button>

            <p id="status">
                {status}
            </p>

            <p id="linkTx">

            </p>
        </div>
    );
};

export default CreateVender;