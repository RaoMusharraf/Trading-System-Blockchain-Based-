import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
const { ethers } = require("ethers");

const SeeVender = (props) => {

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [Tokentime, setTokentime] = useState({});
    const [Invitation, setInvitation] = useState({});
    const [auctionDetails, setAuctionDetails] = useState([]);

    const contractAuctionABI = require('../abi/abi_tender.json');
    const auctionContract = process.env.REACT_APP_CONTRACT;
    const web3 = new Web3(window.ethereum);


    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

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

    const onList = async (TokenId) => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        const transactionParameters = {
            to: auctionContract, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            'data': window.contract.methods.DeleteVRequest(TokenId).encodeABI()//make call to NFT smart contract
        };
        //sign the transaction via Metamask
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        setStatus("✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" + txHash);
        await timeout(10000);
        window.location.reload(false);
    }

    const getData = async () => {

        var auctionData = [];
        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            const total = await window.contract.methods.Requests(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getVender(window.ethereum.selectedAddress).call();

            console.log(total);
            var auctionData = [];
            for (var i = 0; i < total; i++) {
                const auc_data = {
                    "TokenId": all_single[i].Token,
                    "Price": all_single[i].Price,
                    "Delivery": all_single[i].DeleveryTime,
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
    const getTime = async () => {

        console.log(auctionDetails);
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        auctionDetails.map(async (item, index) => {
            let all_s = await window.contract.methods.CheckTime(item.TokenId).call();
            console.log(all_s);
            setTokentime(existingValues => ({
                ...existingValues,
                [item.TokenId]: all_s,
            }))
        })
    }
    const getInvitation = async () => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);

        console.log(auctionDetails);


        console.log(auctionDetails);

        auctionDetails.map(async (item, index) => {
            let all_ten = await window.contract.methods.Total(item.TokenId).call();
            console.log(all_ten, "all_ten");
            let all_s = await window.contract.methods.Accepted(item.TokenId, item.Owner, all_ten.owner).call();

            console.log(all_s);
            setInvitation(existingValues => ({
                ...existingValues,
                [item.TokenId]: all_s,
            }))
        })
    }
    useEffect(() => {
        getInvitation()
        getTime()
    }, [auctionDetails])

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
                        <th scope="col">Delivery Time</th>
                        <th scope="col">Description</th>
                        <th scope="col">Owner</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="tenders">
                    {auctionDetails.map((item, index) => {
                        return (
                            <>
                                <tr>
                                    <td>{item.TokenId}</td>
                                    <td>{item.Price}</td>
                                    <td>{item.Delivery}</td>
                                    <td>{item.Description}</td>
                                    <td>{item.Owner}</td>
                                    <td id="button-tds">
                                        {
                                            Tokentime[item.TokenId] == false ? Invitation[item.TokenId] == false ? <p>Pending</p> : <p>Accepted</p> :
                                                <button id={item.TokenId} onClick={(e) => onList(e.target.id)}>Cancel</button>
                                        }
                                    </td>
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