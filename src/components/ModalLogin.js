import React, {useState, useContext, Component} from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from "yup";
import SVG from 'react-inlinesvg';
import iconClose from '../images/ic_close.svg';
import {login, getIdToken} from './UserFuctions';
import { useHistory } from "react-router-dom";
import { StoreContext } from '../index';

const LoginForm = () => {
    const history = useHistory();
    const stores = useContext(StoreContext);
    const [errMatch, setErrMatch] = useState(false);
    return(
        <Formik 
            initialValues={{email: '', password: ''}}
            validationSchema={yup.object({
                email: yup.string()
                .email('Tên email không hợp lệ')
                .required('Tên email không được để trống'),
                password: yup.string()
                .max(12)
                .required('Mật khẩu không được để trống') 
            })}
            onSubmit={(values, {setSubmitting})=>{
                setTimeout(()=>{
                    const user = {
                        email: values.email,
                        password: values.password
                    }
                    
                    login(user).then(res =>{
                        if(res && res.code === 0){
                            localStorage.setItem('usertoken', res.token)
                            stores.searchStore.setCurToken(res.token);
                            stores.searchStore.setCurId(getIdToken(res.token));
                            history.push("/add");
                        }else{
                            setErrMatch(true);
                        }
                    })
                    setSubmitting(false);
                }, 400);
            }}
        >
            {({resetForm, initialValues}) => (
                <Form className="form-login-formik">
                <label htmlFor="email">Email</label>
                <Field type="text" name="email" placeholder="Nhập email"/>
                <ErrorMessage name="email" component="h1"/>
                <label htmlFor="password" className="mt-1">Mật khẩu</label>
                <Field type="password" name="password" placeholder="Nhập mật khẩu" />
                <ErrorMessage name="password" component="h1"/>
                {errMatch && <div className="error-submit">Email hoặc mật khẩu không đúng</div>}
                <div className="row">
                    <div className="col">
                        <button
                            className="btn btn-outline-secondary w-100 mb-2 btn-set-height"
                            type = "button"
                            onClick={() =>{
                                setErrMatch(false);
                                resetForm(initialValues);                                
                            }}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                    <div className="col">
                        <button
                            className='btn btn-outline-primary w-100 mb-2 btn-forward'
                            type="submit"
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </Form>
            )}
        </Formik>
)
}

class ModalLogin extends Component{
    toggle = () => {
        this.props.onToggle();
    };
    render(){
        return(
            <Modal isOpen={true} toggle={this.toggle} className="modal-dialog-centered modal-custom">
                <form>
                    <ModalHeader className="name-title">
                        <span>ĐĂNG NHẬP</span>
                        <div className="align-items-center btn-close" title="Close" onClick={this.toggle}>
                            <SVG src={iconClose} alt="close"/>
                        </div>
                    </ModalHeader>
                    <ModalBody className="name-body">
                        <LoginForm/>
                    </ModalBody>
                </form>
            </Modal>
        )
    }
}
export default ModalLogin;