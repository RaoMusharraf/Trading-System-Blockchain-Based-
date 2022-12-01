import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const SeeTender = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [Allrequests, setAllrequests] = useState([]);




    const auctionContract = "0xe5513E2C3C8a56099785F2adBe075Ea0A0653eC0";

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

        const web3 = new Web3(window.ethereum);

        const contractAuctionABI = require('../abi/abi_tender.json');
        var auctionData = [];

        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            console.log(window.ethereum.selectedAddress);
            const total = await window.contract.methods.Size(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getTender(window.ethereum.selectedAddress).call();


            console.log(window.contract.methods);

            var auctionData = [];
            var requestData = [];

            for (var i = 0; i < total; i++) {
                const all_sing = await window.contract.methods.SizeVender(all_single[i].TokenId).call();


                const all_s = await window.contract.methods.AllVender(all_single[i].TokenId).call();
                const clonedArr = [...all_s];
                setAllrequests(clonedArr)
                console.log(all_s, "all_s");
                const auc_data = {
                    "TokenId": all_single[i].TokenId,
                    "name": all_single[i].name,
                    "quantity": all_single[i].quantity,
                    "budget": all_single[i].budget,
                    "hours": all_single[i].time,
                    "description": all_single[i].description,
                    "application": all_sing,

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
                                <th scope="col">Description    </th>
                                <th scope="col">Owner</th>


                            </tr>
                        </thead>
                        <tbody id="tenders">
                            {Allrequests.map((item, index) => {
                                return (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.Price}</td>
                                        <td>{item.Description}</td>
                                        <td>{item.owner}</td>
                                        <td><button>Approve</button></td>



                                    </tr>


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
                <table className="table table-striped mtable">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Quantity    </th>
                            <th scope="col">Budget</th>
                            <th scope="col">Hours</th>
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
                                        <td>{item.description}</td>
                                        <td>{item.application} <button onClick={handleShow}>Show Requests </button></td>

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
        </div>
    );
};

export default SeeTender;