import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import Countdown from 'react-countdown';

const { ethers } = require("ethers");

const AllRequests = (props) => {

    const [transection, setTransection] = useState({});
    const [status, setStatus] = useState("");
    const [Tokentime, setTokentime] = useState({});
    const [Invitation, setInvitation] = useState({});
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [auctionDetails1, setAuctionDetails1] = useState([]);
    const [auctionDetails2, setAuctionDetails2] = useState([]);


    const contractAuctionABI = require('../abi/abi_tender.json');
    const auctionContract = process.env.REACT_APP_CONTRACT;
    const web3 = new Web3(window.ethereum);
    window.contract = new web3.eth.Contract(contractAuctionABI, auctionContract);


    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setStatus(status);
        getData();
    }, []);
    const onList = async (TokenId) => {

        try {
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
            for (let index = 0; index > -1; index++) {
                var receipt = await web3.eth.getTransactionReceipt(txHash)
                if (receipt != null) {
                    setTransection(receipt);
                    break;
                }
                await timeout(1000);
                console.log("Hello");
            }

        } catch (err) {
            console.log(err);
            setStatus("😢 Something went wrong while Deleting your Details .");
        }
    }
    const getData = async () => {

        var auctionData = [];
        try {

            const total = await window.contract.methods.Requests(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getVender(window.ethereum.selectedAddress).call();

            console.log(total);
            var auctionData = [];
            var auctionData1 = [];
            var auctionData2 = [];

            for (var i = 0; i < total; i++) {
                let all_ten = await window.contract.methods.Total(all_single[i].Token).call();
                let all_time = await window.contract.methods.CheckTime(all_single[i].Token).call();
                console.log(all_ten, "all_ten");
                let all_s = await window.contract.methods.Invite(all_ten.owner, all_single[i].Token, window.ethereum.selectedAddress).call();
                if (!all_time && all_s) {
                    const auc_data = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "TenderDescription": all_ten.description,
                        "TenderName": all_ten.name,
                        "TenderAddress": all_ten._address
                    }
                    auctionData.push(auc_data);
                } else if (!all_time && !all_s) {
                    const auc_data1 = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "Description": all_single[i].Description,
                        "TenderName": all_ten.name,
                        "TenderAddress": all_ten._address
                    }
                    auctionData1.push(auc_data1);
                } else {
                    const auc_data2 = {
                        "TokenId": all_single[i].Token,
                        "Price": all_single[i].Price,
                        "Delivery": all_single[i].DeleveryTime,
                        "Description": all_single[i].Description,
                        "TenderTime": all_ten.time,
                        "TenderName": all_ten.name,
                        "TenderAddress": all_ten._address
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
    useEffect(async () => {
        if (transection != null) {
            if (transection.status) {
                window.location.reload();
            }
        }
    }, [transection]);
    const getTime = async () => {

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
    }, [auctionDetails1])
    useEffect(() => {
        getTime()
    }, [auctionDetails])
    return (
        <div className="container">

            <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className="mb-2"
            >
                <Tab eventKey="home" title="Accepted">
                    <h1 style={{ textAlign: 'left' }}></h1>
                    <table class="table table-striped mtable">
                        <thead>
                            <tr>
                                <th scope="col">Tender#</th>
                                <th scope="col">Tender Name</th>
                                <th scope="col">Tender Address</th>
                                <th scope="col">Description</th>
                                <th scope="col">PRICE</th>
                                <th scope="col">DELIVERED</th>
                                <th scope="col">REMANING TIME</th>
                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {auctionDetails.map((item, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{item.TokenId}</td>
                                            <td>{item.TenderName}</td>
                                            <td>{item.TenderAddress}</td>
                                            <td>{item.TenderDescription}</td>
                                            <td>{item.Price}</td>
                                            <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.Delivery * 1000)}</td>
                                            <td id="button-tds">
                                                {
                                                    Tokentime[item.TokenId] == true ? <button><Countdown date={item.Delivery * 1000} /></button> : <p>Done</p>
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
                                <th scope="col">Tender#</th>
                                <th scope="col">Tender Name</th>
                                <th scope="col">Tender Address</th>
                                <th scope="col">Price</th>
                                <th scope="col">Description</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {auctionDetails1.map((item, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{item.TokenId}</td>
                                            <td>{item.TenderName}</td>
                                            <td>{item.TenderAddress}</td>
                                            <td>{item.Price}</td>
                                            <td>{item.Description}</td>
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
                                <th scope="col">Tender#</th>
                                <th scope="col">Tender Name</th>
                                <th scope="col">Tender Address</th>
                                <th scope="col">Price</th>
                                <th scope="col">Description</th>
                                <th scope="col">End Time</th>
                                <th scope="col">CANCEL!</th>
                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {auctionDetails2.map((item, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{item.TokenId}</td>
                                            <td>{item.TenderName}</td>
                                            <td>{item.TenderAddress}</td>
                                            <td>{item.Price}</td>
                                            <td>{item.Description}</td>
                                            <td><Countdown date={item.TenderTime * 1000} /></td>
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