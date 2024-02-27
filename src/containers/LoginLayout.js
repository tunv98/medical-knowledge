import React, {Fragment, useState, useContext, useLayoutEffect} from 'react';
import "./main.css";
import "./cusform.css";
import {StoreContext} from "../index";
import {useObserver} from "mobx-react";
import {useHistory} from "react-router-dom";
import { BsFillPersonLinesFill} from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { ListGroup, ListGroupItem, PopoverBody, Popover } from 'reactstrap';
import { getIdToken, getFirstnameToken } from '../components/UserFuctions';
import ModalLogin from '../components/ModalLogin';

export default function LoginLayout(){
    const stores = useContext(StoreContext);
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const [loginState, setLoginState] = useState(false);
    const [popoverOpen, setPopOveOpen] = useState(false);
    const handleClick = () => {
        if(!loginState){
            setModal(!modal);
        }else{
            // history.push("/add");   
        }
    }
    const togglePopover = () => {
        setPopOveOpen(!popoverOpen);
    }
    const pickNew = () => {
        history.push("/add");   
    }
    const signOut = () => {
        setLoginState(false);
        localStorage.removeItem('usertoken');
        stores.searchStore.resetToken();
    }
    useLayoutEffect(() =>{
        if(localStorage.getItem('usertoken')){
            stores.searchStore.setCurToken(localStorage.getItem('usertoken'));
            stores.searchStore.setCurId(getIdToken(localStorage.getItem('usertoken')));
            stores.searchStore.setCurFirstName(getFirstnameToken(localStorage.getItem('usertoken')));
        }
        if(stores.searchStore.curToken){
            setLoginState(true);
        }
    },[])
    const idNameBox = loginState ? "Ypopover" : "Npopover";
    return useObserver(() =>
        <header id="header-layout">
            <div className="header-box" id={idNameBox} onClick={handleClick}>
                {loginState
                ? <FaUserCheck size={20} color="#fff"/>
                : <BsFillPersonLinesFill size={20} color="#fff"/>
                }
            </div>
            {loginState && <Popover
                isOpen={popoverOpen}
                target={'Ypopover'}
                trigger="legacy"
                placement="bottom-end"
                className="popover-file"
                toggle={togglePopover}
            >
                <PopoverBody>
                    <div className="header-pop">Chào <b>{stores.searchStore.curFirstName}</b>
                    </div>
                    <div role="none" className="pop-divider"></div>
                    <ListGroup>
                        <ListGroupItem onClick={pickNew}>Thêm dữ liệu</ListGroupItem>
                        <ListGroupItem onClick={signOut}>Đăng xuất</ListGroupItem>
                    </ListGroup>
                </PopoverBody>
            </Popover>
            }
            {
                modal 
                && <ModalLogin
                        onToggle = {handleClick}
                />
            }
        </header>
        
    )
}
