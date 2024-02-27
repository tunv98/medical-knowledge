import React, {Fragment, useState, useContext, useEffect} from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, Jumbotron, Spinner} from 'reactstrap';
import {addAudio} from "../components/UserFuctions";
import moment from 'moment';
import './audio.css';
import {useObserver} from "mobx-react";
import DatePicker, {registerLocale} from "react-datepicker";
import {storage} from "../firebase";
import "react-datepicker/dist/react-datepicker.css";
import {Toast} from "../toast";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoHome} from "react-icons/go";
import { useHistory } from "react-router-dom";
import {StoreContext} from "../index";
import { getIdToken } from '../components/UserFuctions';
import vi from 'date-fns/locale/vi';
registerLocale('vi', vi)

export default function AddAudioLayout() {
    const [title, setTitle] = useState(""); 
    const [author, setAuthor] = useState(""); 
    const [position, setPosition] = useState(""); 
    const [file, setFile] = useState(null); 
    const [date, setDate] = useState(new Date()); 
    const [stateFile, setStateFile] = useState(0);
    const [isSubmit, setIsSubmit] = useState(false); 
    const history = useHistory();
    const stores = useContext(StoreContext);

    const onChange = (date) => {
        setDate(date)
    }
    useEffect(() =>{
        if(localStorage.getItem('usertoken')){
            if(!stores.searchStore.curToken){
                stores.searchStore.setCurToken(localStorage.getItem('usertoken'));
                stores.searchStore.setCurId(getIdToken(localStorage.getItem('usertoken')));
            }
        }
        else{
            history.push("");
        }
    },[])
    const changeValue = (e, label) => {
        // eslint-disable-next-line default-case
        switch (label) {
            case 0:
                setTitle(e.target.value);
                break;
            case 1:
                setAuthor(e.target.value);
                break;
            case 2:
                setPosition(e.target.value);
                break;
            case 3:
                if(e.target.files[0]){
                    let file = e.target.files[0];
                    validateFile(file);
                    setFile(e.target.files[0]);
                }
                break;
        }
    }
    const validateFile =  file => {
        let reader = new FileReader();
        try{
            let duration = -1;
            reader.readAsArrayBuffer(file);
            reader.onload = function (event) {
                let audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.decodeAudioData(event.target.result, function(buffer) {
                    duration = buffer.duration;
                    console.log("The duration of the song is of: " + duration + " seconds");
                    if(duration !== -1){
                        if(duration <= 90){
                            setStateFile(1);
                        }
                        else{
                            setStateFile(2);
                        }
                    }
                });
            };
        }
        catch (e) {
            reader.onerror = function (event) {
                console.error("An error ocurred reading the file: ", event);
            };
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!isSubmit ){
            setIsSubmit(true);
            if(stateFile !== 0 && file !== null) {
                let arr = {
                    title: title,
                    author: author,
                    position: position,
                    file: file,
                    date: date,
                    link: "",
                    status: 1,
                    user_id: stores.searchStore.curId
                };
                moment.locale('vi');
                let curDate = moment(arr.date).format('YYYY-MM-DD');
                arr.date = curDate;
                const nowdate = `${moment().format("DD_MM_YYYY_hh_mm_ss")}`
                let uploadTask, str;
                if(stateFile === 1){
                    uploadTask = storage.ref(`audio/${nowdate}`).put(file)
                    str = "audio";
                }
                else{
                    uploadTask = storage.ref(`pending/${nowdate}`).put(file)
                    str = "pending"
                    arr.status = 0;
                }
                uploadTask.on('state_changed',
                    (snapshot) => {
                        //progress func
                    },
                    (error) => {
                        //error func
                        console.log(error)
                    },
                    () => {
                        //complete func
                        storage.ref(str).child(nowdate).getDownloadURL()
                            .then(url => {
                                if (url) {
                                    console.log("url", url);
                                    arr.link = url;
                                    addAudio(arr).then(res => {
                                        if (res && res.status === 200) {
                                            switch (res.data.code) {
                                                case 0:
                                                    Toast("1")
                                                    break;
                                                case 1:
                                                    Toast("0")
                                                    break;
                                                case 2:
                                                    Toast("3")
                                                    break;
                                                case 3:
                                                    Toast("1")
                                                    break;
                                                default:
                                                    Toast("1")
                                                    break;
                                            }
                                        }
                                        else{
                                            Toast("1")
                                        }
                                        setIsSubmit(false);
                                    })
                                }
                                else{
                                    setIsSubmit(false);
                                }
                            })
                            .catch(e => {
                                console.log(e);
                                Toast("1")
                                setIsSubmit(false);
                            })
                    });
            }
            else{
                Toast("4")
                setIsSubmit(false);
            }
        } 
    }
    const clickHome = () => {
        history.push("");
    }
    const handleCancel = () => {
        setTitle("");
        setAuthor("");
        setPosition("");
        setFile(null);
        setDate(new Date());
    }        
    return useObserver(() =>
        <Fragment>
            <div className="header-box-custom" onClick= {()=> clickHome()}>
                <GoHome size={20} color="#fff" />
            </div>
            <div id="audio-layout">
                <Jumbotron>
                    <Form>
                        <FormGroup>
                            <Label for="title">Nội dung</Label>
                            <Input type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange = {(e) =>changeValue(e,0)}
                                    autoFocus={true}
                            />
                        </FormGroup>
                        <Row>
                            <Col md={5}>
                                <FormGroup>
                                    <Label for="author">Tác giả</Label>
                                    <Input type="text"
                                            name="author"
                                            id="author"
                                            value={author}
                                            onChange = {(e) =>changeValue(e,1)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={7}>
                                <FormGroup>
                                    <Label for="position">Nơi làm việc</Label>
                                    <Input type="text"
                                            name="position"
                                            id="position"
                                            value={position}
                                            onChange = {(e) =>changeValue(e,2)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={5}>
                                <FormGroup className="option_calendar">
                                    <Label for="calendar">Thời gian</Label>
                                    <DatePicker
                                        onChange={onChange}
                                        selected={date}
                                        locale="vi"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={7}>
                                <FormGroup>
                                    <Label for="file">Tập tin 
                                        <span className="file-limit">
                                            {stateFile === 0 ? " *" 
                                            : stateFile ===1 ? " *Tập tin có thể  xử lý ngay sau khi đồng ý!"
                                            : " *Tập tin thời lượng lớn sẽ hoàn tất sau!"}
                                        </span>
                                        </Label>
                                    <Input type="file"
                                            name="file"
                                            id="file"
                                            accept="audio/wav, audio/x-wav, audio/mp3"
                                            onChange = {(e) =>changeValue(e,3)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col md={6} className="text-center">
                                <Button outline={true}
                                        color={"primary"}
                                        className="custom-btn"
                                        onClick={handleSubmit}>
                                    {isSubmit && <Spinner size="sm" color="success" />}
                                    Đồng ý
                                </Button>
                            </Col>
                            <Col md={6} className="text-center">
                                <Button outline={true}
                                        color={"secondary"}
                                        className="custom-btn"
                                        onClick={handleCancel}>Hủy bỏ
                                </Button>
                            </Col>
                            <ToastContainer/>
                        </Row>
                    </Form>
                </Jumbotron>
            </div>
        </Fragment>
    );
}