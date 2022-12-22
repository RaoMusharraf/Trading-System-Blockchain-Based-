import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, createBox } from "../utils/interact.js";
import Web3 from "web3";
const { ethers } = require("ethers");

const CreateTender = (props) => {
    const [loadingState, setLoadingState] = useState(false);

    const auctionContract = process.env.REACT_APP_CONTRACT;
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    //State variables
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [budget, setBudget] = useState("");
    const [hours, setHours] = useState("");
    const [description, setDescription] = useState("");
    const [addr, setAddress] = useState("");
    const [trans, setTransec] = useState("");


    const web3 = new Web3(window.ethereum);
    const auction_contractABI = require('../abi/abi_tender.json');
    window.contract = new web3.eth.Contract(auction_contractABI, auctionContract);


    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setStatus(status);
    }, []);

    useEffect(async () => {
        if (trans != null) {
            if (trans.status) {
                setLoadingState(false)
                setStatus("");
                setName("");
                setQuantity("");
                setBudget("");
                setHours("");
                setDescription("");
                setAddress("");
                setTransec("");

            }
        }
    }, [trans]);

    const onList = async (name, quantity, budget, hours, description) => {
        if (name == '' || quantity == '' || budget == '' || hours == '' || addr == '' || description == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {
            //Contract Interaction
            setLoadingState(true)
            console.log(name);
            console.log(quantity);

            try {
                const transactionParameters = {
                    to: auctionContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.tender(name, quantity, budget, hours, addr, description).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                setStatus("✅ Check out your transaction on Etherscan .");
                const count = 0;
                for (let index = 0; index > -1; index++) {
                    var receipt = await web3.eth.getTransactionReceipt(txHash)
                    if (receipt != null) {
                        setTransec(receipt);
                        break;
                    }
                    await timeout(1000);
                    console.log("Hello");
                }
            } catch (err) {
                console.log(err);
                setStatus("😢 Something went wrong while listing your Details .");
                setLoadingState(false)
            }
        }
    }

    return (
        <>
            {
                loadingState ? (
                    <div className="loader-wrao" style={{ visibility: "visible" }} >
                        <div className="loader"></div>
                    </div >) : <></>
            }
            <div className="container createtender">
                <form>
                    <h2>TITLE</h2>
                    <input
                        type="text"
                        placeholder="Enter Tender Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                    <h2>Quantity</h2>
                    <input
                        type="text"
                        placeholder="Enter Quantity"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)} />
                    <h2>Budget</h2>
                    <input
                        type="text"
                        placeholder="Enter Budget (ETH)"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)} />
                    <h2>Time</h2>
                    <input
                        type="text"
                        placeholder="Enter Ending Minutes"
                        value={hours}
                        onChange={(event) => setHours(event.target.value)}
                    />
                    <h2>Address</h2>
                    <input
                        type="text"
                        placeholder="Enter Your Address"
                        value={addr}
                        onChange={(event) => setAddress(event.target.value)} />
                    <h2>Description</h2>
                    <textarea
                        rows={3}
                        type="text"
                        placeholder="Enter Tender Description"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value)
                            // console.log(event.target.value);
                        }} />
                </form>
                <br />
                <button id="list" onClick={() => onList(name, quantity, budget, hours, description)}>
                    List
                </button>
                <p id="status">
                    {status}
                </p>
            </div>
        </>

    );
};

export default CreateTender;