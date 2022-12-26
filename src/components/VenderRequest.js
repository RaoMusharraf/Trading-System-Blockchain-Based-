import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, createBox } from "../utils/interact.js";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

const { ethers } = require("ethers");

const CreateVender = (props) => {

    const [loadingState, setLoadingState] = useState(false);
    const [Token, setTokenid] = useState("");
    const [delivery, setDelivey] = useState("");
    const [status, setStatus] = useState("");
    const [trans, setTransection] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");

    const web3 = new Web3(window.ethereum);
    const auctionContract = process.env.REACT_APP_CONTRACT;
    const auction_contractABI = require('../abi/abi_tender.json');
    window.contract = new web3.eth.Contract(auction_contractABI, auctionContract);

    // const navigate = useNavigate()
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();
        setStatus(status);
    }, []);
    const onList = async (budget, description, delivery) => {
        if (budget == '' || delivery == '' || description == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {

            try {
                setLoadingState(true)
                // console.log(Token, "localStorage.lToken", budget, "budget", description, "description", delivery, "delivery");
                //set up your Ethereum transaction
                const transactionParameters = {
                    to: auctionContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.vender(Token, budget, description, delivery).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });

                localStorage.lToken = "";
                setStatus("✅ Check out your transaction on Etherscan .");
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
                setStatus("😢 Something went wrong while listing your Details .");
                setLoadingState(false)
            }
        }
    }
    useEffect(() => {
        let temp;
        temp = localStorage.lToken;
        setTokenid(temp);
    }, [])
    useEffect(async () => {
        if (trans != null) {
            if (trans.status) {
                setLoadingState(false)
                setTokenid("");
                setDelivey("");
                setStatus("");
                setBudget("");
                setDescription("");
                setTransection("");
            }
        }
    }, [trans]);
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
                    <h2>TOKEN</h2>
                    <input
                        type="text"
                        placeholder="Enter Token"
                        value={Token}
                        onChange={(event) => setTokenid(event.target.value)} />
                    <h2>Price</h2>
                    <input
                        type="text"
                        placeholder="Enter Price"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)} />
                    <h2>Delivery</h2>
                    <input
                        type="text"
                        placeholder="Enter Minutes"
                        value={delivery}
                        onChange={(event) => setDelivey(event.target.value)} />
                    <h2>Description</h2>
                    <textarea
                        rows={3}
                        type="text"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)} />
                </form>
                <br />
                <button id="list" onClick={() => onList(budget, description, delivery)}>
                    List
                </button>
                <p id="status">
                    {status}
                </p>
            </div>
        </>
    );
};

export default CreateVender;