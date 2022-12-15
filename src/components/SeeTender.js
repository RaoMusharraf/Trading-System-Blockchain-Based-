import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const SeeTender = (props) => {

    const [show, setShow] = useState(false);
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [auctionDet, setAuctionDet] = useState([]);
    const [auctionDetails2, setAuctionDetails2] = useState([]);
    const [auctionDetails3, setAuctionDetails3] = useState([]);
    const [Allrequests, setAllrequests] = useState([]);
    const [Tokentime, setTokentime] = useState({});
    const [Invitation, setInvitation] = useState({});
    const [DoneP, setDone] = useState({});

    const web3 = new Web3(window.ethereum);
    const auctionContract = process.env.REACT_APP_CONTRACT;
    const contractAuctionABI = require('../abi/abi_tender.json');

    const handleClose = () => setShow(false);
    const handleShow = async (TokenId) => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        setShow(true)
        const all_s = await window.contract.methods.AllVender(TokenId).call();
        console.log(all_s, "all_s");
        const clonedArr = [...all_s].sort((a, b) => b.rating - a.rating);
        console.log(clonedArr, "all_ssss");
        setAllrequests(clonedArr)
    };

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

    const getData = async () => {

        var auctionData = [];
        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            console.log(window.ethereum.selectedAddress);
            const total = await window.contract.methods.Size(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getTender(window.ethereum.selectedAddress).call();

            var auctionData = [];
            var auctionData1 = [];
            var auctionData2 = [];
            var auctionData3 = [];
            for (var i = 0; i < total; i++) {
                const all_sing = await window.contract.methods.SizeVender(all_single[i].TokenId).call();
                let comm = await window.contract.methods.Communication(all_single[i].TokenId, window.ethereum.selectedAddress).call();
                let Accpt = await window.contract.methods.Invite(window.ethereum.selectedAddress, all_single[i].TokenId, comm.receiver).call()
                console.log(Accpt, "comAccptm");
                console.log(comm.done, "comm.done");
                if (Accpt == false) {
                    const auc_data = {
                        "TokenId": all_single[i].TokenId,
                        "name": all_single[i].name,
                        "quantity": all_single[i].quantity,
                        "budget": all_single[i].budget,
                        "hours": all_single[i].time,
                        "Address": all_single[i]._address,
                        "description": all_single[i].description,
                        "application": all_sing,
                    }
                    auctionData.push(auc_data);
                }
                if (Accpt == true) {
                    const auc_data1 = {
                        "TokenId": all_single[i].TokenId,
                        "name": all_single[i].name,
                        "quantity": all_single[i].quantity,
                        "budget": all_single[i].budget,
                        "hours": all_single[i].time,
                        "Address": all_single[i]._address,
                        "description": all_single[i].description,
                        "application": all_sing,
                    }
                    auctionData1.push(auc_data1);
                }
            }
            console.log(auctionData, "auctionData");
            console.log(auctionData1, "auctionData1");
            console.log(auctionData2, "auctionData2");

            setAuctionDetails(auctionData);
            setAuctionDet(auctionData1);
            setAuctionDetails2(auctionData2);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log(auctionDet, "auctionDet12345667");
    }, [auctionDet])

    const invitation = async (_token) => {

        var Arr = _token.split(',');
        const token = Arr[0];
        const price = Arr[1];
        const receiver = Arr[3];
        console.log(_token, "price");
        console.log(receiver, "receiver");
        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            //set up your Ethereum transaction
            const transactionParameters = {
                to: auctionContract, // Required except during contract publications.
                from: window.ethereum.selectedAddress, // must match user's active address.
                'data': window.contract.methods.AcceptInvitation(token, receiver, window.ethereum.selectedAddress, price).encodeABI()//make call to NFT smart contract
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

    const DonePay = async (_token) => {

        console.log(_token, "_token");

        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            let comm = await window.contract.methods.Communication(_token, window.ethereum.selectedAddress).call();
            console.log(comm.price, "comm123");
            //set up your Ethereum transaction
            const transactionParameters = {
                to: auctionContract, // Required except during contract publications.
                from: window.ethereum.selectedAddress, // must match user's active address.
                value: web3.utils.toHex(comm.price),
                'data': window.contract.methods.Done(comm.receiver, window.ethereum.selectedAddress, _token).encodeABI()//make call to NFT smart contract
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

    const getInvitation = async () => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        console.log(auctionDetails);
        auctionDetails.map(async (item, index) => {

            let all_ten = await window.contract.methods.Total(item.TokenId).call();
            console.log(all_ten, "item owner");
            let comm = await window.contract.methods.Communication(item.TokenId, all_ten.owner).call();
            console.log(comm.receiver, "comm");
            console.log(all_ten.owner, "al ten owner");
            await window.contract.methods.Invite(window.ethereum.selectedAddress, item.TokenId, comm.receiver).call().then(res => {
                //await window.contract.methods.Invite(item.TokenId, comm.receiver, all_ten.owner).call().then(res => {
                console.log(res, "setInvitation");
                setInvitation(existingValues => ({
                    ...existingValues,
                    [item.TokenId]: res,
                }))
            });


        })
    }

    const getTime = async () => {

        console.log(auctionDetails);
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        auctionDetails.map(async (item, index) => {
            let all_s = await window.contract.methods.CheckTime(item.TokenId).call();
            console.log(all_s, "all_s");
            setTokentime(existingValues => ({
                ...existingValues,
                [item.TokenId]: all_s,
            }))
        })
    }

    const Done = async () => {

        console.log(auctionDet, "auctionDet1");
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        auctionDet.map(async (item, index) => {
            let all_s = await window.contract.methods.Communication(item.TokenId, window.ethereum.selectedAddress).call();
            console.log(all_s.done, "Done");
            setDone(existingValues => ({
                ...existingValues,
                [item.TokenId]: all_s.done,
            }))
        })
    }

    useEffect(() => {
        getTime()
    }, [auctionDetails])

    useEffect(() => {
        Done()
        console.log(auctionDet);
    }, [auctionDet])

    useEffect(() => {
        getInvitation()
        console.log(setInvitation, "setInvitation")
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

        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{console.log(Allrequests)} Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <table className="table table-striped mtable">
                        <thead>
                            <tr>
                                <th scope="col">S#</th>
                                <th scope="col">Price</th>
                                <th scope="col">Deliver Time</th>
                                <th scope="col">Description </th>
                                <th scope="col">Owner</th>
                                <th scope="col">Approve</th>
                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {Allrequests.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.Price}</td>
                                            <td>{item.DeleveryTime}</td>
                                            <td>{item.Description}</td>
                                            <td>{item.owner}</td>
                                            <td>
                                                <button id={item} onClick={(e) => invitation(e.target.id)}>
                                                    Accept
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
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
                    <Tab eventKey="home" title="Requests">
                        <h1 style={{ textAlign: 'left' }}></h1>
                        <table class="table table-striped mtable">
                            <thead>
                                <tr>
                                    <th scope="col">Token#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity    </th>
                                    <th scope="col">Budget</th>
                                    <th scope="col">Hours</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Requests</th>
                                </tr>
                            </thead>
                            <tbody id="tenders">
                                {auctionDetails.map((item, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{item.TokenId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.budget}</td>
                                                <td>{item.hours}</td>
                                                <td>{item.Address}</td>
                                                <td>{item.description}</td>
                                                <td id="button-tds">
                                                    {
                                                        Tokentime[item.TokenId] == false ? <button id={item.TokenId} onClick={(e) => handleShow(e.target.id)}>{item.application}</button> : <p>{item.application}</p>
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
                    <Tab eventKey="profile" title="Payment">
                        <h1 style={{ textAlign: 'left' }}></h1>
                        <table class="table table-striped mtable">
                            <thead>
                                <tr>
                                    <th scope="col">Token#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity    </th>
                                    <th scope="col">Budget</th>
                                    <th scope="col">Hours</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Requests</th>
                                </tr>
                            </thead>
                            <tbody id="tenders">
                                {auctionDet.map((item, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{item.TokenId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.budget}</td>
                                                <td>{item.hours}</td>
                                                <td>{item.Address}</td>
                                                <td>{item.description}</td>
                                                <td id="button-tds">
                                                    {
                                                        DoneP[item.TokenId] == true ? <button id={item.TokenId} onClick={(e) => DonePay(e.target.id)}>Payment</button> : <p>Done</p>
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
                </Tabs>
                <br />
                <p id="status">
                    {status}
                </p>
            </div>
        </div>
    );
};

export default SeeTender;