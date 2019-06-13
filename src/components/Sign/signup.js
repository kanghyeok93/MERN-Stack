import React, {Component} from 'react';
import {Form, Button, Row, Col, Alert} from 'react-bootstrap';
import axios from "axios";

import './signup.scss';

class Signup extends Component {

    state = {
        username : '',
        name : '',
        email : '',
        password : '',
        passwordConfirmation : '',
        errors : '',
    };

    componentDidMount() {
        axios.get('/user/sign')
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    onSubmit = (e) => {
        const{ username, name, email, password, passwordConfirmation } = this.state;
        e.preventDefault();

        const obj = {
            username : username,
            name : name,
            email : email,
            password : password,
            passwordConfirmation : passwordConfirmation,
        };

        axios.post('/user/add',obj)
            .then(res => this.setState({
                errors : res.data,
            }));
    };

    render() {
        const {username, name, email, password, passwordConfirmation, errors} = this.state;
        const { onSubmit,handleChange} = this;

        if(errors === 'Add complete'){
            // setTimeout(()=> {
                this.props.history.push('/login');
            // },1000);
        }
        return (
            <div className="Sign">
               <Form onSubmit={onSubmit}>
                   <h3>New User</h3>
                   <Form.Group as={Row}>
                       <Form.Label column sm={2} htmlFor="username">
                           ID*
                       </Form.Label>
                       <Col sm={10}>
                           <Form.Control type="text" id="username" name="username" onChange={handleChange} value={username}/>
                       </Col>
                       {
                           (errors.username) ? <span className="sign_error">{errors.username.message}</span> : null
                       }
                   </Form.Group>
                   <Form.Group as={Row}>
                       <Form.Label column sm={2} htmlFor="name">
                           Name*
                       </Form.Label>
                       <Col sm={10}>
                           <Form.Control type="text" id="name" name="name" onChange={handleChange} value={name}/>
                       </Col>
                       {
                           (errors.name) ? <span className="sign_error">{errors.name.message}</span> : null
                       }
                   </Form.Group>
                   <Form.Group as={Row}>
                       <Form.Label column sm={2} htmlFor="email">
                           Email
                       </Form.Label>
                       <Col sm={10}>
                           <Form.Control type="text" id="email" name="email" onChange={handleChange} value={email}/>
                       </Col>
                       {
                           (errors.email) ? <span className="sign_error">{errors.email.message}</span> : null
                       }
                   </Form.Group>
                   <Form.Group as={Row}>
                       <Form.Label column sm={2} htmlFor="password">
                           Password*
                       </Form.Label>
                       <Col sm={10}>
                           <Form.Control type="password" id="password" name="password" onChange={handleChange} value={password}/>
                       </Col>
                       {
                           (errors.password) ? <span className="sign_error">{errors.password.message}</span> : null
                       }
                   </Form.Group>
                   <Form.Group as={Row}>
                       <Form.Label column sm={2} htmlFor="passwordConfirmation">
                           Password Confirmation*
                       </Form.Label>
                       <Col sm={10}>
                           <Form.Control type="password" id="passwordConfirmation" name="passwordConfirmation" onChange={handleChange} value={passwordConfirmation}/>
                       </Col>
                       {
                           (errors.passwordConfirmation) ? <span className="sign_error">{errors.passwordConfirmation.message}</span> : null
                       }
                   </Form.Group>
                   <Form.Text className="text-muted">
                       *Required
                   </Form.Text>
                   <div className="button">
                        <Button variant="success" type="submit">Submit</Button>
                   </div>
                   {
                       (errors.unhandled) ? <Alert variant="danger">{errors.unhandled}</Alert> : null
                   }
               </Form>
            </div>
        );
    }
}

export default Signup;