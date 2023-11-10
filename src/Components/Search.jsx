import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useParams } from "react-router-dom";
import { Frown } from 'lucide-react';


const Search = () => {

    const { searchTerm } = useParams();
    const [coin, setCoin] = useState([]);
    const [error, setError] = useState(false);
    const [similarCoins, setSimilarCoins] = useState([]);

    const shortenDescription = (string) => {
        return string.length > 450 ? string.substr(0, 450) + "..." : string;
    }

    useEffect(() => {
        axios.get(`https://api.coingecko.com/api/v3/coins/${searchTerm}`)
            .then((res) => {
                new Promise((resolve, reject) => {
                    console.log(res);
                    setCoin(res.data);
                    resolve(res.data)
                })
                    .catch((err => {
                        console.log(err);
                    }))
                    .then((res) => {
                        axios.get(`https://api.coingecko.com/api/v3/search?query=${res.name}`)
                            .then((res) => {
                                setSimilarCoins(res.data.coins.splice(0, 5));
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err)
                setError(true);
            })

    }, [searchTerm])

    return <>

        {error == true ?
            <>
            <div className="errorBox">
                <h1>No coins found under "{searchTerm}"</h1>
                <Frown size={65}color="white"></Frown>
            </div>
            </>
            : null}
        {coin.id !== undefined ?
            <div className="searchCoinBox">
                <h3 style={{ fontSize: "3rem" }}>{coin.name}</h3>
                <div className="d-flex">
                    <img src={coin.image?.large} className="coinImg"></img>
                    <div className="coinInfo">
                        <p className="container-sm description ">{shortenDescription(coin.description?.en)}</p>
                        <div className="line"></div>
                        {coin.market_cap_rank !== null ? <p className="description">Market cap rank: #{coin?.market_cap_rank}</p> : <p className="description">No Market cap rank available</p>}
                        <p className="description">Price in USD: ${coin.market_data?.current_price.usd}</p>
                        <p className="description">USD Price Change in the Last 24 Hours: {coin.market_data.price_change_24h_in_currency?.usd?.toFixed(3)}</p>
                        <p className="description">All Time High: ${coin.market_data?.ath.usd}</p>
                    </div>
                </div>
            </div> : null}

        {similarCoins.length === 0 || similarCoins.length === 1 ? null :
            <>
                <h3>Similar to your search</h3>
                <div className="d-flex">
                    {similarCoins.map((oneCoin) => oneCoin.name !== coin.name ?
                        (
                            <div key={oneCoin.name} className="srchCard m-2" >
                                <img src={oneCoin.large} className="srchImg" alt="..."></img>
                                <div className="card-body">
                                    <h3>{oneCoin.name}</h3>
                                    <p>{oneCoin.symbol}</p>
                                    {oneCoin.market_cap_rank !== null ? <p>Market Cap Rank # {oneCoin.market_cap_rank}</p> : <p>No Market Cap Rank </p>}
                                    <Link to={`/${oneCoin.id}`}> <button className="btn btn-primary">View Coin</button></Link>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            </>
        }
        <Link to={"/"}><button className="btn btn-primary">Return to Main Page</button></Link>
    </>
}
export default Search;