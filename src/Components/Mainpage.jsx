import React, { useEffect, useState } from "react";
import axios from "axios"
import "./style.css"
import { useNavigate } from "react-router-dom";
import { ArrowBigDown, ArrowBigUp, Search, ShieldAlert } from 'lucide-react';

const MainPage = () => {

    const navigate = useNavigate();
    const [trendingCoins, setTrendingCoins] = useState([]);
    const [bigCoins, setBigCoins] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [scrollAmount, setScrollAmount] = useState(0);

    const changeHandler = (event) => {
        setSearchValue(event.target.value);
    }
    const searchHandler = (search) => {
        navigate(`${search}`)
    }
    const scrollHandler = (amt) => {
        if ((scrollAmount !== 0 || amt !== 200) && (scrollAmount !== -4000 || amt !== -200)) {
            setScrollAmount(scrollAmount + amt);
        }
    }

    const getCoins = () => {
        axios.get("https://api.coingecko.com/api/v3/search/trending")
            .then(res => {
                // console.log(res.data.coins)
                setTrendingCoins(res.data.coins.slice(0, 5));
            }).catch(err => {
                console.log("error=>", err)
            });

        axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1")
            .then(res => {
                // console.log(res.data);
                setBigCoins(res.data);
            }).catch(err => {
                console.log("error=>", err)
            });
    }
    useEffect(() => {
        getCoins();
    }, [])

    return (<>
        <div className="searchContainer d-flex">
                    <Search  onClick={() => searchHandler(searchValue)} className="srchIcon"></Search>
            <div className="search">
                <div className="d-flex">
                    <input type="text" className="searchBar" name="search" placeholder="Search Coins" value={searchValue} onChange={changeHandler} />
                    {/* <button className="searchbtn" onClick={() => searchHandler(searchValue)}> Search</button> */}
                </div>
                <div className="dropdown">
                    {bigCoins.filter(coin => {
                        const term = searchValue.toLowerCase();
                        const coinName = coin.name.toLowerCase();
                        return term && coinName.startsWith(term);
                    }).map((coin) => (
                            // {console.log(coin)}
                            <div key={coin.id} onClick={() => searchHandler(coin.id)} className=" dropdownResult" ><p>{coin.name}</p></div>
                        ))}
                    {searchValue !== "" ? <p onClick={() => searchHandler(searchValue)} className="dropdownResult">Search for "{searchValue}"</p> : null}
                </div>
            </div>
        </div>

        <div className="d-flex">
            <div className="half">
                <h3>Trending Coins</h3>
                <div className="trending">
                    {trendingCoins?.map(coin => (
                        <div key={coin.id} style={{ height: "110px" }} className="oneCoin">
                            <img onClick={() => searchHandler(coin.item.id)} src={coin.item.small} alt="" />
                            <div className="info">
                                <h3 onClick={() => searchHandler(coin.item.id)}>{coin.item.name}</h3>
                                <p>Market cap rank: #{coin.item.market_cap_rank}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="half">
                <h3>Most Popular Coins</h3>
                <button className="arrow" ><ArrowBigUp className="arrow2" onClick={() => scrollHandler(200)} size={64} /></button>
                <div className="halfContainer">
                    {bigCoins.length !== 0 ? bigCoins?.map(coin => (
                        <div style={{ translate: `0 ${scrollAmount}px` }} key={coin.id} className="oneCoin">
                            <img onClick={() => searchHandler(coin.id)} style={{ "width": "50px", cursor: "pointer" }} src={coin.image} alt="" />
                            <div className="info">
                                <h3 onClick={() => searchHandler(coin.id)}>{coin.name}</h3>
                                <h4>${coin.current_price}</h4>
                                <p>Market cap rank: #{coin.market_cap_rank}</p>
                            </div>
                        </div>
                    )) :
                        <>
                            <h3 className="errorMessage">Too many API calls.  Try again in a few minutes</h3>
                            <ShieldAlert color="white" size={64}></ShieldAlert>
                        </>}
                </div>
                <button className="arrow"><ArrowBigDown className="arrow2" onClick={() => scrollHandler(-200)} size={64} /> </button>
            </div>
        </div>
    </>
    )
}
export default MainPage;