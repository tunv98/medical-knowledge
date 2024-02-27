import React, {Component, useContext} from 'react';
import moment from 'moment';
import {StoreContext} from "../index";
import {useObserver} from "mobx-react";

export default function ContentBox (props) {
    const stores = useContext(StoreContext);
    const {source, id_audio} = props;
    const clickAudio = () => {
        // e.preventDefault();
        const {id_audio} = props;
        if(stores.searchStore.curPlay !== 0 && id_audio !== stores.searchStore.curPlay){
            let curAudio = document.getElementById(stores.searchStore.curPlay.toString());
            curAudio.pause();
        }
        stores.searchStore.setCurPlay(id_audio);
    }
    moment.locale('vi');
    let time = moment(source.date).format('DD/MM/YYYY');
    return useObserver(() =>
        <div id="content-result">
            <div className="wrap-number-result">
                <div className="wrap-child">
                    <div className="wrap-audio">
                        <audio
                            id={id_audio}
                            controls={true}
                            autoPlay={false}
                            src={source.refs}
                            onPlay={clickAudio}
                            type="audio/mpeg"/>
                    </div>
                    <div className="wrap-info">
                        <section className="info-author">
                            <div className="author-content">{source.title}</div>
                            <div className="author-name">{source.author}</div>
                            <div className="author-position">{source.position}</div>
                        </section>
                        <section className="info-time">
                            <p>{time}</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}