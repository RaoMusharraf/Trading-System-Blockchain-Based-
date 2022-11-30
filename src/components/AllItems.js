import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";


const SeeTender = (props) => {

    const auctionContract = "0x0233319e61551b0c557c104D3BC90F32BE78F545";
    let history = useHistory();
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
            //.const total = await window.contract.methods.Size(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.AllTender().call();
            console.log(all_single);
            //console.log(total);

            var auctionData = [];

            for (var i = 0; i < all_single.length; i++) {
                const auc_data = {
                    "TokenId": all_single[i].TokenId,
                    "name": all_single[i].name,
                    "quantity": all_single[i].quantity,
                    "budget": all_single[i].budget,
                    "hours": all_single[i].time,
                    "description": all_single[i].description,
                    "Owner": all_single[i].Owner,
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

            <h1 style={{ textAlign: 'left' }}> Tenders </h1>
            <table class="table table-striped mtable">
                <thead>
                    <tr>
                        <th scope="col">Token</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity    </th>
                        <th scope="col">Budget</th>
                        <th scope="col">Hours</th>
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
                                    <td id={item.TokenId}>{item.TokenId}</td>

                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.budget}</td>
                                    <td>{item.hours}</td>
                                    <td>{item.description}</td>
                                    <td>{item.Owner}</td>
                                    {/* <td><Link className="tender-req-btn" to="/Vender_request"> Create</Link></td> */}
                                    <td><button id={item.TokenId} className="tender-req-btn" onClick={(e) => {
                                        localStorage.lToken = e.target.id
                                        history.push("/Vender_request");

                                    }} > Create</button></td>

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

export default SeeTender;