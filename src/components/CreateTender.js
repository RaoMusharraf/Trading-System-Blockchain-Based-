import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, createBox } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
const { ethers } = require("ethers");

const CreateTender = (props) => {

    const auctionContract = "0x9088F1f489816984D16c88d699416b4E39068345";
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [budget, setBudget] = useState("");
    const [hours, setHours] = useState("");
    const [description, setDescription] = useState("");

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

    const onList = async (name, nftId, bid, eDate) => {
        if (name == '' || quantity == '' || budget == '' || hours == '' || description == '') {
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
                    'data': window.contract.methods.tender(name, quantity, budget, hours, description).encodeABI()//make call to NFT smart contract
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
        }
    }
    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
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
                <h2>Name</h2>
                <input
                    type="text"
                    placeholder="Enter Item Name"
                    onChange={(event) => setName(event.target.value)} />
                <h2>Quantity</h2>
                <input
                    type="text"
                    placeholder="Enter Quantity"
                    onChange={(event) => setQuantity(event.target.value)} />
                <h2>Budget</h2>
                <input
                    type="text"
                    placeholder="Enter Budget in PKR"
                    onChange={(event) => setBudget(event.target.value)} />
                <h2>Total Hours</h2>
                <input
                    type="text"
                    placeholder="Enter Ending Hours"
                    onChange={(event) => setHours(event.target.value)}
                />
                <h2>Description of Item</h2>
                <input
                    type="text"
                    placeholder="Enter Description"
                    onChange={(event) => setDescription(event.target.value)} />
            </form>
            <br />
            <button id="list" onClick={() => onList(name, quantity, budget, hours, description)}>
                List
            </button>
            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default CreateTender;