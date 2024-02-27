import React, {Fragment} from 'react';
import {useObserver} from "mobx-react";
import logo from '../images/logo.jpg';
import SearchBox from '../components/SearchBox';
import LoginLayout from './LoginLayout';
import "./main.css";
import "./cusform.css";

export default function MainLayout () {
    return useObserver(() =>
        <Fragment>
            <div id="main-layout">
                <LoginLayout/>
                <div id="content-layout">
                    <a className="wrap-main">
                        <img src= {logo} className="main-logo" alt="Medical"/>
                    </a>
                    <SearchBox
                        mainLayout = {true}
                    />
                </div>
            </div>
            
        </Fragment>
    )
}