import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SeeTender = (props) => {

    const [Tokentime, setTokentime] = useState({})
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const [timer, setmushi] = useState("")
    const web3 = new Web3(window.ethereum);

    const contractAuctionABI = require('../abi/abi_tender.json');
    const auctionContract = process.env.REACT_APP_CONTRACT;
    let navigate = useNavigate();

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(async () => {

        getData();

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
            const all_single = await window.contract.methods.AllTender().call();
            var auctionData = [];
            for (var i = 0; i < all_single.length; i++) {
                const auc_data = {
                    "TokenId": all_single[i].TokenId,
                    "name": all_single[i].name,
                    "quantity": all_single[i].quantity,
                    "budget": all_single[i].budget,
                    "hours": all_single[i].time,
                    "Address": all_single[i]._address,
                    "description": all_single[i].description,
                    "Owner": all_single[i].owner,
                }
                auctionData.push(auc_data);
            }
            console.log(auctionData, "auctionData")

            setAuctionDetails(auctionData);
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
    }
    useEffect(() => {
        getTime()
    }, [auctionDetails])

    return (
        <div className="container">

            <table class="table table-striped mtable all-items">
                <thead>
                    <tr>
                        <th scope="col">Token#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity    </th>
                        <th scope="col">Budget</th>
                        <th scope="col">Hours</th>
                        <th scope="col">Address</th>
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
                                    <td>{item.Address}</td>
                                    <td>{item.description}</td>
                                    <td>{item.Owner}</td>
                                    <td id="button-tds">
                                        {
                                            Tokentime[item.TokenId] == true ? <button id={item.TokenId} className="tender-req-btn" onClick={(e) => {
                                                localStorage.lToken = e.target.id
                                                navigate("/Vender_request")
                                            }} > Create</button> : <p>Close</p>
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
    );
};

export default SeeTender;



