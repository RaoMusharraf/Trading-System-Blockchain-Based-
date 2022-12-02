import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const SeeTender = (props) => {
    const web3 = new Web3(window.ethereum);
    const auctionContract = "0x9088F1f489816984D16c88d699416b4E39068345";
    const contractAuctionABI = require('../abi/abi_tender.json');
    const [show, setShow] = useState(false);
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [Allrequests, setAllrequests] = useState([]);
    const [Tokentime, setTokentime] = useState({})

    const handleClose = () => setShow(false);
    const handleShow = async (TokenId) => {
        window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
        setShow(true)
        const all_s = await window.contract.methods.AllVender(TokenId).call();
        console.log(all_s);
        const clonedArr = [...all_s]
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


            //console.log(window.contract.methods);

            var auctionData = [];
            var requestD = [];
            var requestData = [];

            for (var i = 0; i < total; i++) {
                const all_sing = await window.contract.methods.SizeVender(all_single[i].TokenId).call();
                // console.log(all_s.length, "all_s");
                // for (var j = 0; j < all_s.length; j++) {
                //     const ven_data = {
                //         "Token": all_s[j].Token,
                //         "Price": all_s[j].Price,
                //         "DeleveryTime": all_s[j].DeleveryTime,
                //         "Owner": all_s[j].owner,
                //     }
                //     console.log(all_s.length, "hello");
                //     requestD.push(ven_data)
                // }
                // const ven_data = {
                //     "Token": all_s[i].Token,
                //     "Price": all_s[i].Price,
                //     "DeleveryTime": all_s[i].DeleveryTime,
                //     "Owner": all_s[i].owner,
                // }
                // console.log(ven_data, "requestD");
                // // requestData.push(ven_data)
                // const clonedArr = [...all_s];
                // requestData.push(clonedArr);
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
            // console.log(requestData, "requestData");
            // setAllrequests(requestData);
            // console.log(Allrequests, "requestData2");
            // console.log(auctionData, "auctionData");
            setAuctionDetails(auctionData);
            console.log(auctionDetails, "auctionData2");
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

        console.log(window.contract.methods);



        // if (all_s == true) {
        //     console.log("enter");

        //     // const myelem = document.getElementById("button-tds");
        //     // // console.log(myelem.children);
        //     // myelem.children[0].style.display = "none";
        //     // const mytext = myelem.children[0].innerHTML;
        //     // const myp = document.createElement("p")
        //     // myp.innerHTML = myelem.children[0].innerHTML;
        //     // myelem.appendChild(myp)

        // }
        // console.log(all_s);
    }
    useEffect(() => {
        getTime()
    }, [auctionDetails])

    useEffect(() => {
        console.log(Tokentime);
    }, [Tokentime])


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
                                            <td><button>Accept</button></td>
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

                <h1 style={{ textAlign: 'left' }}>Tenders </h1>
                <table className="table table-striped mtable">
                    <thead>
                        <tr>
                            <th scope="col">Token#</th>
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
                                        <td id="button-tds">
                                            {
                                                Tokentime[item.TokenId] == true ? <p>{item.application}</p> :
                                                    <button id={item.TokenId} onClick={(e) => handleShow(e.target.id)}>{item.application} Requests </button>
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
        </div>
    );
};

export default SeeTender;