import React, {Fragment, useState, useContext, useEffect} from 'react';
import logo from '../images/logo.jpg';
import SearchBox from '../components/SearchBox';
import './search.css';
import {StoreContext} from "../index";
import {useObserver} from "mobx-react";
import { useHistory } from "react-router-dom";
import ContentBox from "../components/ContentBox";
import "./main.css";
import "./cusform.css";
import LoginLayout from './LoginLayout';
import ScrollList from "../components/ScrollList";

export default function SearchLayout () {
    const stores = useContext(StoreContext);
    const history = useHistory();
    const clickLogo = () =>{
        stores.searchStore.setCurKeySearch("");
        stores.searchStore.resetListAudio();
        history.push("");
    }
    const handleScroll = ()=> {
        stores.searchStore.setLoadMoreAudio(stores.searchStore.curKeySearch);
    }
    return useObserver(() =>
        <Fragment>
            <div id="part-layout">
                <ScrollList
                    threshold={0}
                    onScrollLoad={handleScroll}
                    divClass="main-scroll"
                    newHeight={stores.searchStore.newHeight}
                >
                <LoginLayout/>
                <div id="frame-search">
                    <a className="wrap-main">
                        <img src= {logo} className="main-logo" alt="Medical"
                             onClick={clickLogo}
                        />
                    </a>
                    <SearchBox/>
                </div>
                <div id="number-result">
                    <div className="wrap-number-result">
                        <div>
                            <div className="number-result">
                                {
                                    !stores.searchStore.totalAudio
                                        ? "Không có kết quả tìm kiếm"
                                        : `${"Có "}${stores.searchStore.totalAudio}${" kết quả tìm kiếm"}`
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {!!stores.searchStore.ListAudio.length 
                &&  stores.searchStore.ListAudio.map((item, key)=>{
                            return (
                                <ContentBox
                                    source={item}
                                    key={item.id}
                                    id_audio = {item.id}
                                />
                            )
                        })
                    }
                </ScrollList>
            </div>
        </Fragment>
    )
}