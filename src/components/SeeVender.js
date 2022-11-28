import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import logo from '../lilfrens-logo.png';
import Web3 from "web3";
import Countdown from "react-countdown";
const { ethers } = require("ethers");

const SeeVender = (props) => {

    const auctionContract = "0xB7123e97618a136ba140a5ec1B26737DbBAc6dc9";
    const frensContract = "0x2EDD7A51D82220Bb878980ff892380720442D892";

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [bid, setBid] = useState([]);
    const [approve, setApprove] = useState("");
    const [claimR, setClaimR] = useState("");

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

    const onApprove = async (bid) => {

        if (bid == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {

            //Contract Interaction
            const web3 = new Web3(window.ethereum);
            const contractABI = require('../abi/abi_vender.json');
            const allow_price = ethers.utils.parseEther(bid);

            try {
                window.contract = await new web3.eth.Contract(contractABI, frensContract);
                //set up your Ethereum transaction
                const transactionParameters = {
                    to: frensContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.approve(auctionContract, allow_price).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                await timeout(10000);
                setApprove("done");
                // setStatus("✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const bidPrice = async (index, bid) => {
        if (bid == '') {
            setStatus("Please fill all values!!!!!!!!!!!");
            alert("Please fill all values!!!!!!!!!!!");
        } else {

            //Contract Interaction
            const web3 = new Web3(window.ethereum);
            const auction_contractABI = require('../abi/abi_vender.json');
            const price = ethers.utils.parseEther(bid);

            try {
                window.contract = await new web3.eth.Contract(auction_contractABI, auctionContract);
                //set up your Ethereum transaction
                const transactionParameters = {
                    to: auctionContract, // Required except during contract publications.
                    from: window.ethereum.selectedAddress, // must match user's active address.
                    'data': window.contract.methods.bid(index, price).encodeABI()//make call to NFT smart contract
                };
                //sign the transaction via Metamask
                const txHash = await window.ethereum
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                setStatus("✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash);
                await timeout(5000);
                window.location.reload(false);
            } catch (err) {
                console.log(err);
                setStatus("😢 Something went wrong while listing your NFT for auction");
            }
        }
    };

    const getData = async () => {

        const web3 = new Web3(window.ethereum);
        const contractAuctionABI = require('../abi/abi_vender.json');
        var auctionData = [];

        try {
            window.contract = await new web3.eth.Contract(contractAuctionABI, auctionContract);
            // const total_nfts = await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
            const all_single = await window.contract.methods.getAllList().call();

            var auctionData = [];

            for (var i = 0; i < all_single.length; i++) {
                const contractNftABI = require('../abi/abi_vender.json');
                const contractNftAddress = all_single[i].addressNFTCollection;
                window.contract = await new web3.eth.Contract(contractNftABI, contractNftAddress);
                const nUrl = await window.contract.methods.tokenURI(all_single[i].nftId).call();
                const response = await fetch(nUrl);
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }
                const nft_data = await response.json();
                const auc_data = {
                    "addressNFTCollection": all_single[i].addressNFTCollection,
                    "addressPaymentToken": all_single[i].addressPaymentToken,
                    "bidCount": all_single[i].bidCount,
                    "creator": all_single[i].creator,
                    "currentBidOwner": all_single[i].currentBidOwner,
                    "currentBidPrice": all_single[i].currentBidPrice,
                    "endAuction": all_single[i].endAuction,
                    "index": all_single[i].index,
                    "nftId": all_single[i].nftId,
                    "attributes": nft_data.attributes,
                    "description": nft_data.description,
                    "edition": nft_data.edition,
                    "image": "https://ipfs.infura.io/ipfs/" + nft_data.image.substring(7),
                    "name": nft_data.name
                }

                auctionData.push(auc_data);
            }

            setAuctionDetails(auctionData);
        } catch (err) {
            console.log(err);
        }
    };

    const claim = async (index) => {

        //Contract Interaction
        const web3 = new Web3(window.ethereum);
        const auction_contractABI = require('../abi/abi_vender.json');

        try {
            window.contract = await new web3.eth.Contract(auction_contractABI, auctionContract);
            //set up your Ethereum transaction
            const transactionParameters = {
                to: auctionContract, // Required except during contract publications.
                from: window.ethereum.selectedAddress, // must match user's active address.
                'data': window.contract.methods.claimToken(index).encodeABI()//make call to NFT smart contract
            };
            //sign the transaction via Metamask
            const txHash = await window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
            setStatus("✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash);
            await timeout(5000);
            window.location.reload(false);
        } catch (err) {
            console.log(err);
            setStatus("😢 Something went wrong while listing your NFT for auction");
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
            <h1 style={{ textAlign: 'left' }}>
                Your Requests For Getting Tenders</h1>

            <table class="table table-striped mtable">
                <thead>
                    <tr>
                        <th scope="col">Token-Id</th>
                        <th scope="col">Tenders</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody id="tenders">
                </tbody>
            </table>
            <div class="row">
                {auctionDetails.length > 0
                    ? auctionDetails.map((item, index) => {
                        return (
                            <div class="column">
                                <div class="card">
                                    <img src={item.image} alt={item.image} style={{ width: '100%' }} />
                                    <div class="container">
                                        <h4><b>{item.name}</b></h4>
                                        <p>{item.description}</p>
                                        <p>Token ID: {item.currentBidOwner.substring(0, 5)}........{item.currentBidOwner.substring(35)}</p>
                                        <p>Tender: {item.currentBidOwner.substring(0, 5)}........{item.currentBidOwner.substring(35)}</p>
                                        <p>Price: {parseInt(ethers.utils.formatEther(item.currentBidPrice))}</p>
                                        <p>Request Ending In: <Countdown
                                            onComplete={() =>
                                                window.location.reload(false)
                                            }
                                            date={
                                                new Date(parseInt(item.endAuction) * 1000)
                                            }
                                        /></p>
                                        <input
                                            type="text"
                                            placeholder="Enter Price IN PKR"
                                            onChange={(event) => setBid(event.target.value)} />
                                        <br />
                                        <br />
                                        {approve == "" ?
                                            <button id="approve" onClick={() => onApprove(bid)}>
                                                Approve
                                            </button>
                                            :
                                            <button id="bidPrice" onClick={() => bidPrice(item.index, bid)}>
                                                Set Bid
                                            </button>
                                        }
                                        {/* <br/>
                                        <br/>
                                        <button id="bidPrice" onClick={() => claim(item.index)}>
                                            Claim
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div></div>
                }
            </div>
            <br />
            <p id="status">
                {status}
            </p>
        </div>
    );
};

export default SeeVender;