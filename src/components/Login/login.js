import React, {Component} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";

import './login.scss';

class Login extends Component {

    state = {
        username : '',
        password : '',
        errors : '',
        redirectTo : null
    };

    componentDidMount(){
        axios.get('/login')
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    onSubmit = (e) => {
        const{ username, password } = this.state;
        e.preventDefault();

        const obj = {
            username : username,
            password : password,
        };

        axios.post('/login',obj)
            .then(res => {
                if(res.data.msg === "login"){
                    this.props.updateUser({
                        loggedIn : true,
                        username : res.data.username
                    });
                    this.setState({
                        redirectTo : '/',
                    })
                }else{
                    this.setState({
                        errors : res.data,
                    })
                }
            }).catch(error => {
                if(error.response.status === 401){
                    this.setState({
                        errors : {login : "아이디 또는 비밀번호가 맞지 않습니다 !"}
                    })
                }
        })
    };

    render() {
        const { username,password,errors,redirectTo }  = this.state;
        const { onSubmit,handleChange } = this;

        if(redirectTo){
            return window.location.href='/';
        }
        return (
            <div className="Login">
                <Form onSubmit={onSubmit}>
                    <h3 style={{marginBottom:"30px"}}>Login</h3>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="username">
                            ID
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" id="username" name="username" onChange={handleChange} value={username}/>
                        </Col>
                        {
                            (errors.username) ? <span className="login_error">{errors.username}</span> : null
                        }
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="password">
                            Password
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="password" id="password" name="password" onChange={handleChange} value={password}/>
                        </Col>
                        {
                            (errors.password) ? <span className="login_error">{errors.password}</span> : null
                        }
                    </Form.Group>
                    {
                        (errors.login) ? <span className="login_error_sub">{errors.login}</span> : null
                    }
                    <div style={{marginTop:"30px"}}>
                        <Button variant="success" type="submit">Submit</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

export default Login;