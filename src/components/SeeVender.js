import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const { ethers } = require("ethers");

const AllRequests = (props) => {

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [Tokentime, setTokentime] = useState({});
    const [Invitation, setInvitation] = useState({});
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [auctionDetails1, setAuctionDetails1] = useState([]);
    const [auctionDetails2, setAuctionDetails2] = useState([]);
    const [auction, setAuction] = useState([]);


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
            var auctionData1 = [];
            var auctionData2 = [];

            for (var i = 0; i < total; i++) {
                let all_ten = await window.contract.methods.Total(all_single[i].Token).call();
                let all_time = await window.contract.methods.CheckTime(all_single[i].Token).call();
                console.log(all_time, "all_time", i);
                let all_s = await window.contract.methods.Accepted(all_single[i].Token, all_single[i].owner, all_ten.owner).call();
                if (!all_time && all_s) {
                    const auc_data = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "Description": all_single[i].Description,
                        "Owner": all_single[i].owner,
                        "Flag": all_s
                    }
                    auctionData.push(auc_data);
                } else if (!all_time && !all_s) {
                    const auc_data1 = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "Description": all_single[i].Description,
                        "Owner": all_single[i].owner,
                        "Flag": all_s
                    }
                    auctionData1.push(auc_data1);
                } else {
                    const auc_data2 = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "Description": all_single[i].Description,
                        "Owner": all_single[i].owner,
                        "Flag": all_s
                    }
                    auctionData2.push(auc_data2);
                }
            }
            console.log(auctionData)

            setAuctionDetails(auctionData);
            setAuctionDetails1(auctionData1);
            setAuctionDetails2(auctionData2);

        } catch (err) {
            console.log(err);
        }
    };
    const getTime = async () => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        let all_com = await window.contract.methods.getVender(window.ethereum.selectedAddress).call();
        for (var i = 0; i < all_com.length; i++) {
            let all_ten = await window.contract.methods.Total(all_com[i].Token).call();
            let all_comm = await window.contract.methods.Communication(all_com[i].Token, all_ten.owner).call();
            console.log(all_comm.done, "all_comm");
            setTokentime(existingValues => ({
                ...existingValues,
                [all_com[i].Token]: all_comm.done,
            }))
        }
    }
    const getInvitation = async () => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        let all_com = await window.contract.methods.getVender(window.ethereum.selectedAddress).call();
        for (var i = 0; i < all_com.length; i++) {
            let all_ten = await window.contract.methods.Total(all_com[i].Token).call();
            let all_comm = await window.contract.methods.Pending(all_ten.owner, all_com[i].Token).call();
            console.log(all_comm, "all_comm");
            setInvitation(existingValues => ({
                ...existingValues,
                [all_com[i].Token]: all_comm,
            }))
        }

    }
    useEffect(() => {
        getInvitation()
    }, [])
    useEffect(() => {
        getTime()
    }, [auction])

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
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="home" title="Accepted">
                    <h1 style={{ textAlign: 'left' }}></h1>
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
                                                    Tokentime[item.TokenId] == true ? <p>Accepted</p> : <p>Done</p>
                                                }

                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                            }
                        </tbody>
                    </table>
                    {/* AllRequests */}
                </Tab>
                <Tab eventKey="profile" title="Pending">
                    <h1 style={{ textAlign: 'left' }}></h1>
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
                            {auctionDetails1.map((item, index) => {
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
                                                    Invitation[item.TokenId] == false ? <p>Pending</p> : <p>Close</p>
                                                }
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </Tab>
                <Tab eventKey="contact" title="Cancel">
                    <h1 style={{ textAlign: 'left' }}></h1>
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
                            {auctionDetails2.map((item, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{item.TokenId}</td>
                                            <td>{item.Price}</td>
                                            <td>{item.Delivery}</td>
                                            <td>{item.Description}</td>
                                            <td>{item.Owner}</td>
                                            <td id="button-tds">
                                                <button id={item.TokenId} onClick={(e) => onList(e.target.id)}>Cancel</button>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </Tab>
            </Tabs>

            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default AllRequests;