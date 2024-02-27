import React, {Component, useEffect, useContext} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {StoreContext} from "../index";

export default function ScrollList({customstyle, threshold, loading, divClass, newHeight, children, onScrollLoad}){
    const stores = useContext(StoreContext);
    const scroll = React.createRef();
    useEffect(()=>{
        let temp = 600;
        if(document.getElementById('part-layout')){
            temp =  document.getElementById('part-layout').clientHeight;
        }
        stores.searchStore.setNewHeight(temp);
        scroll.current.scrollToTop();
    },[]);
    const handleScroll = event => {
        const scrolledToBottom
            = Math.ceil(event.scrollTop + event.clientHeight)
            >= event.scrollHeight - threshold;
        if (scrolledToBottom && !loading) {
            onScrollLoad();
        }
    }
    return (
        <Scrollbars
            autoHide={true}
            autoHeight={true}
            autoHeightMin={600}
            autoHeightMax={newHeight}
            autoHideTimeout={500}
            style={customstyle}
            ref={scroll}
            onScrollFrame={handleScroll}
            className={divClass}
        >
            {children}
        </Scrollbars>
    )
}
ScrollList.defaulProps = {
    customstyle: {},
    threshold: 20,
    loading: false,
    divClass: '',
    newHeight: 600
}