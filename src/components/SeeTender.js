import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Countdown from 'react-countdown';

//const { Web3Auth } = require("@web3auth/modal")

const SeeTender = (props) => {

    const [show, setShow] = useState(false);
    const [setReq, setAllreq] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [auctionDet, setAuctionDet] = useState([]);
    const [Allrequests, setAllrequests] = useState([]);
    const [Tokentime, setTokentime] = useState({});
    const [transection, setTransection] = useState({});

    const [trans, setTransec] = useState("");
    const [DoneP, setDone] = useState({});

    const web3 = new Web3(window.ethereum);
    const auctionContract = process.env.REACT_APP_CONTRACT;
    const contractAuctionABI = require('../abi/abi_tender.json');
    window.contract = new web3.eth.Contract(contractAuctionABI, auctionContract);

    const handleClose = () => setShow(false);
    const handleShow = async (TokenId) => {
        setShow(true);
        const all_s = await window.contract.methods.AllVender(TokenId).call();
        const clonedArr = [...all_s].sort((a, b) => a.Price - b.Price);
        console.log(clonedArr, "clonedArr");
        setAllrequests(clonedArr)
    };
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setStatus(status);
        getData();
    }, []);
    const getData = async () => {
        try {
            await timeout(626);
            console.log(window.ethereum.selectedAddress);
            const all_single = await window.contract.methods.getTender(window.ethereum.selectedAddress).call();
            console.log("all_single", all_single);
            var auctionData = [];
            var auctionData1 = [];
            var auctionData2 = [];
            var deadline = [];
            for (var i = 0; i < all_single.length; i++) {
                deadline.push(all_single[i].start + (all_single[i].time));

                let Accpt = await window.contract.methods.Pending(window.ethereum.selectedAddress, all_single[i].TokenId).call()
                console.log(Accpt, "comAccptm");
                console.log();
                if (Accpt == false) {
                    auctionData.push(all_single[i]);
                }
                else {
                    auctionData1.push(all_single[i]);
                    const Communication = await window.contract.methods.Communication(all_single[i].TokenId, window.ethereum.selectedAddress).call();
                    const Finder = await window.contract.methods.Finder(all_single[i].TokenId, Communication.receiver).call();
                    const VenderReq = await window.contract.methods.Venders(Finder, all_single[i].TokenId).call();
                    auctionData2.push(VenderReq);
                }
            }
            setAuctionDetails(auctionData);
            setAuctionDet(auctionData1);
            setAllreq(auctionData2);

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getData();
    }, [trans, transection,])
    const invitation = async (_token) => {

        var Arr = _token.split(',');
        const token = Arr[0];
        const price = Arr[1];
        const receiver = Arr[3];
        console.log(_token);
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
            for (let index = 0; index > -1; index++) {
                var receipt = await web3.eth.getTransactionReceipt(txHash)
                if (receipt != null) {
                    setTransec(receipt);
                    break;
                }
                await timeout(1000);
                console.log("Hello");
            }
            //setStatus("✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" + txHash);
        } catch (err) {
            console.log(err);
            //setStatus("😢 Something went wrong while listing your NFT for auction");
        }
    }

    const DonePay = async (_token) => {

        console.log(_token, "_token");
        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            let comm = await window.contract.methods.Communication(_token, window.ethereum.selectedAddress).call();
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

            for (let index = 0; index > -1; index++) {
                var receipt = await web3.eth.getTransactionReceipt(txHash)
                if (receipt != null) {
                    setTransection(receipt);
                    break;
                }
                await timeout(1000);
                console.log("Hello");
            }
            //setStatus("✅ Check out your transaction on Etherscan: https://etherscan.io/tx/" + txHash);
        } catch (err) {
            console.log(err);
            //setStatus("😢 Something went wrong while listing your NFT for auction");
        }
    }
    const getTime = async () => {

        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        auctionDetails.map(async (item, index) => {
            let all_s = await window.contract.methods.CheckTime(item.TokenId).call();
            console.log(all_s, "getTime");
            setTokentime(existingValues => ({
                ...existingValues,
                [item.TokenId]: all_s,
            }))
        })
    };
    useEffect(() => {
        getTime()
    }, [auctionDetails])
    const Done = async () => {

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
        Done()
    }, [auctionDet])


    return (

        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <table className="table table-striped mtable">

                        <thead>
                            <tr>
                                <th scope="col">S#</th>
                                <th scope="col">PRICE</th>
                                <th scope="col">DELIVERED</th>
                                <th scope="col">DESCRIPTION</th>
                                <th scope="col">OWNER</th>
                                <th scope="col">RATING</th>
                                <th scope="col">APPROVE!</th>
                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {console.log(Allrequests, "Allrequests")}
                            {Allrequests.map((item, index) => {
                                let updtime = Number(Date.now() + (item.Delivered * 1000));
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.Price}</td>
                                            <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(updtime)}</td>
                                            <td>{item.Description}</td>
                                            <td>{item.owner}</td>
                                            <td>{item.rating}</td>

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
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                >
                    <Tab eventKey="home" title="Tenders">
                        <h1 style={{ textAlign: 'left' }}></h1>
                        <table class="table table-striped mtable">
                            <thead>
                                <tr>
                                    <th scope="col">TOKEN#</th>
                                    <th scope="col">TENDER</th>
                                    <th scope="col">QUANTITY</th>
                                    <th scope="col">BUDGET</th>
                                    <th scope="col">START</th>
                                    <th scope="col">END</th>
                                    <th scope="col">ADDRESS</th>
                                    <th scope="col">DESCRIPTION</th>
                                    <th scope="col">REQUESTS!</th>
                                </tr>
                            </thead>
                            <tbody id="tenders">
                                {auctionDetails.map((item, index) => {
                                    let updt = Number(item.time) + 10;
                                    return (
                                        <>
                                            <tr>
                                                <td>{item.TokenId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.budget}</td>
                                                <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.start * 1000)}</td>
                                                <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.time * 1000)}</td>
                                                <td>{item._address}</td>
                                                <td>{item.description}</td>
                                                <td id="button-tds">
                                                    {
                                                        Tokentime[item.TokenId] == false ? <button id={item.TokenId} onClick={(e) => handleShow(e.target.id)}>
                                                            REQUESTS
                                                        </button> :
                                                            <button><Countdown date={updt * 1000} onComplete={() => {
                                                                getData()
                                                            }
                                                            } /></button>
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
                                    <th scope="col">TOKEN#</th>
                                    <th scope="col">TENDER</th>
                                    <th scope="col">QUANTITY</th>
                                    <th scope="col">START</th>
                                    <th scope="col">END</th>
                                    <th scope="col">ADDRESS</th>
                                    <th scope="col">DESCRIPTION</th>
                                    <th scope="col">PAYMENT!</th>

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
                                                <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.start * 1000)}</td>
                                                <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.time * 1000)}</td>
                                                <td>{item._address}</td>
                                                <td>{item.description}</td>
                                                <td id="button-tds">
                                                    {
                                                        DoneP[item.TokenId] == true ? <button id={item.TokenId} onClick={(e) => DonePay(e.target.id)}>PAYMENT</button> : <p>COMPLETE</p>
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
                    <Tab eventKey="accepted" title="Accepted">
                        <h1 style={{ textAlign: 'left' }}></h1>
                        <table class="table table-striped mtable">
                            <thead>
                                <tr>
                                    <th scope="col">TOKEN#</th>
                                    <th scope="col">PRICE</th>
                                    <th scope="col">DELIVERED</th>
                                    <th scope="col">DESCRIPTION</th>
                                    <th scope="col">OWNER</th>
                                    <th scope="col">SHIPPED!</th>
                                </tr>
                            </thead>
                            <tbody id="tenders">
                                {
                                    (setReq && setReq.length > 0) ?
                                        (setReq.map((item, index) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>{item.Token}</td>
                                                        <td>{item.Price}</td>
                                                        <td>{new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(item.DeleveryTime * 1000)}</td>
                                                        <td>{item.Description}</td>
                                                        <td>{item.owner}</td>
                                                        <td id="button-tds">
                                                            {
                                                                DoneP[item.Token] == true ? <button><Countdown date={item.DeleveryTime * 1000} /></button> : <p>COMPLETE</p>
                                                            }
                                                        </td>

                                                    </tr>
                                                </>
                                            )
                                        })) : <></>
                                }
                            </tbody>
                        </table>
                    </Tab>
                </Tabs>
                <br />
                <p id="status">
                    {status}
                </p>

                <p>

                </p>
            </div>
        </div>
    );
};

export default SeeTender;