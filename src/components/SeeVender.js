import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
const { ethers } = require("ethers");

const SeeVender = (props) => {

    const auctionContract = "0xe5513E2C3C8a56099785F2adBe075Ea0A0653eC0";

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);

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
            console.log(window.ethereum.selectedAddress);
            const total = await window.contract.methods.Requests(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getVender(window.ethereum.selectedAddress).call();
            console.log(all_single);
            console.log(total);

            var auctionData = [];

            for (var i = 0; i < total; i++) {
                const auc_data = {
                    "TokenId": all_single[i].Token,
                    "Price": all_single[i].Price,
                    "Description": all_single[i].Description,
                    "Owner": all_single[i].owner,
                }
                auctionData.push(auc_data);
            }
            console.log(auctionData)

            setAuctionDetails(auctionData);
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
        <div className="container">
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

            <h1 style={{ textAlign: 'left' }}>Requests </h1>
            <table class="table table-striped mtable">
                <thead>
                    <tr>
                        <th scope="col">Token#</th>
                        <th scope="col">Price</th>
                        <th scope="col">Description</th>
                        <th scope="col">Owner</th>
                    </tr>
                </thead>
                <tbody id="tenders">
                    {auctionDetails.map((item, index) => {
                        return (
                            <>
                                <tr>
                                    <td>{item.TokenId}</td>
                                    <td>{item.Price}</td>
                                    <td>{item.Description}</td>
                                    <td>{item.Owner}</td>
                                </tr>

                            </>
                        )
                    })
                    }
                </tbody>
            </table>
            <br />
            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default SeeVender;