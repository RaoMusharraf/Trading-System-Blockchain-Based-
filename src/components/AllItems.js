import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import Countdown from 'react-countdown';

const SeeTender = (props) => {

    const [Tokentime, setTokentime] = useState({})
    const [status, setStatus] = useState("");
    const [auctionDetails, setAuctionDetails] = useState([]);
    const web3 = new Web3(window.ethereum);

    const contractAuctionABI = require('../abi/abi_tender.json');
    const auctionContract = process.env.REACT_APP_CONTRACT;
    window.contract = new web3.eth.Contract(contractAuctionABI, auctionContract);
    let navigate = useNavigate();
    useEffect(async () => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const all_single = await window.contract.methods.AllTender().call();
            const clonedArr = [...all_single].sort((a, b) => b.TokenId - a.TokenId);
            console.log(clonedArr, "ssss");
            setAuctionDetails(clonedArr);
        } catch (err) {
            console.log(err);
        }
    };
    const getTime = async () => {

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
        getTime();
    }, [auctionDetails])

    return (
        <div className="container">

            <table class="table table-striped mtable all-items">
                <thead>
                    <tr>
                        <th scope="col">TOKEN#</th>
                        <th scope="col">TENDER</th>
                        <th scope="col">QUANTITY</th>
                        <th scope="col">BUDGET</th>
                        <th scope="col">END</th>
                        <th scope="col">ADDRESS</th>
                        <th scope="col">DESCRIPTION</th>
                        <th scope="col">OWNER</th>
                        <th scope="col">STATUS</th>
                    </tr>
                </thead>
                <tbody id="tenders">
                    {auctionDetails.map((item, index) => {
                        let updtime = Number(item.time) + 10;
                        return (
                            <>
                                <tr>
                                    <td id={item.TokenId}>{item.TokenId}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.budget}</td>
                                    <td><Countdown date={updtime * 1000} onComplete={() => {
                                        getData()
                                    }
                                    } /></td>
                                    <td>{item._address}</td>
                                    <td>{item.description}</td>
                                    <td>{item.owner}</td>
                                    <td id="button-tds">
                                        {
                                            Tokentime[item.TokenId] == true ? <button id={item.TokenId} className="tender-req-btn" onClick={(e) => {
                                                localStorage.lToken = e.target.id
                                                navigate("/Vender_request")
                                            }} >APPLY</button> : <p>END</p>
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



