import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import './searchbox.css';
import ic_search from '../images/ic_search.svg';
import ic_close from '../images/ic_close.svg';
import { StoreContext } from '../index';
import { useObserver } from 'mobx-react';
import {getListAudio, encode, decode} from './UserFuctions';
import {useLocation} from 'react-router-dom';

export default function SearchBox() {
    const stores = useContext(StoreContext);
    const history = useHistory();
    const location = useLocation();
    const [keySearch, setKeySearch] = useState("");
    useEffect(() =>{
        if(location.search && location.search.split("?key=").pop() && keySearch === "" && !stores.searchStore.stateRefresh){
            let key = location.search.split("?key=").pop();
            setKeySearch(decode(key));
            stores.searchStore.getListAudio(false, key);
            stores.searchStore.setCurKeySearch(key);
        }
        else{
            setKeySearch(decode(stores.searchStore.curKeySearch));
        }
    }, []);
    const handleChange = event =>{
        setKeySearch(event.target.value);
    };
    const handleClear = event =>{
        setKeySearch("");
    };
    const handleSubmit = event =>{
        event.preventDefault();
        stores.searchStore.resetListAudio();
        if(keySearch){
            stores.searchStore.stateRefresh = true;
            const key = encode(keySearch);
            stores.searchStore.getListAudio(false, key);
            stores.searchStore.setCurKeySearch(key);
            history.push(`${"/search?key="}${key}`);
        }
    };

    return useObserver(() =>
        <div>
            <form onSubmit={handleSubmit} >
                <div id="search-box">
                    <div className="wrap-box">
                        <img src={ic_search} alt="S"/>
                        <input type="text"
                               value={keySearch}
                               className="input-box"
                               placeholder="Nhập từ khóa tìm kiếm" autoFocus={true}
                               onChange={handleChange}
                        />
                        <div className="btn-close-wrap">
                            {keySearch ?
                                <div className="align-items-center btn-close" onClick={handleClear}>
                                    <img src={ic_close} alt="S"/>
                                </div> : null}
                        </div>
                    </div>
                </div>
            </form>
        </div>

    )
}