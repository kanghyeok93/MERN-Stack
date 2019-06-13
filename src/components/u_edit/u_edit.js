import React, {Component} from 'react';
import {Button, Col, Form, Row, Alert} from "react-bootstrap";
import {Link} from 'react-router-dom';
import axios from "axios";

import './u_edit.scss';

class UEdit extends Component {

    state ={
        currentPassword : '',
        username : '',
        name : '',
        email : '',
        newPassword : '',
        passwordConfirmation : '',
        errors : '',
    };


    componentDidMount() {
        const { match } = this.props;
        axios.get('/user/edit/' + match.params.username )
            .then(res => {
                this.setState({
                    username : res.data.username,
                    name : res.data.user.name,
                    email : res.data.user.email,
                })
            })
            .catch(err => console.log(err))
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    onSubmit = (e) => {
        const { currentPassword,username,name,email,newPassword,passwordConfirmation } = this.state;
        e.preventDefault();

        const obj = {
            currentPassword : currentPassword,
            username : username,
            name : name,
            email : email,
            newPassword : newPassword,
            passwordConfirmation : passwordConfirmation,
        };

        axios.post('/user/update/' + this.props.match.params.username, obj)
            .then(res => this.setState({
                errors : res.data,
            }));
    };


    render() {
        const { currentPassword,username,name,email,newPassword,passwordConfirmation,errors} = this.state;

        if(errors === 'Update complete'){
            // setTimeout(()=> {
                this.props.history.push('/users');
            // },1000);
        }
        const { onChange,onSubmit } = this;
        return (
            <div className="UEdit">
                <Link to={'/ushow/' + this.props.match.params.username} className="usb">
                        <Button variant="danger">Back</Button>
                </Link>
                <h3 style={{margin:"30px 0"}}>Edit User</h3>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="currentPassword">
                            Current Password*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="password" id="currentPassword" name="currentPassword"
                                onChange={onChange} value={currentPassword}
                            />
                        </Col>
                        {
                            (errors.currentPassword) ? <span className="u_edit_error">{errors.currentPassword.message}</span> : null
                        }
                    </Form.Group>
                    <fieldset disabled>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="username">
                            ID*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" id="username" name="username"
                                  onChange={onChange} value={username}
                            />
                        </Col>
                        {
                            (errors.username) ? <span className="u_edit_error">{errors.username.message}</span> : null
                        }
                    </Form.Group>
                    </fieldset>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="name">
                            Name*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" id="name" name="name"
                                      onChange={onChange} value={name}
                            />
                        </Col>
                        {
                            (errors.name) ? <span className="u_edit_error">{errors.name.message}</span> : null
                        }
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="email">
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" id="email" name="email"
                                      onChange={onChange} value={email}
                            />
                        </Col>
                        {
                            (errors.email) ? <span className="u_edit_error">{errors.email.message}</span> : null
                        }
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="newPassword">
                            New Password
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="password" id="newPassword" name="newPassword"
                                      onChange={onChange} value={newPassword}
                            />
                        </Col>
                        {
                            (errors.newPassword) ? <span className="u_edit_error">{errors.newPassword.message}</span> : null
                        }
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="newPassword">
                            Password Confirmation
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="password" id="passwordConfirmation" name="passwordConfirmation"
                                      onChange={onChange} value={passwordConfirmation}
                            />
                        </Col>
                        {
                            (errors.passwordConfirmation) ? <span className="u_edit_error">{errors.passwordConfirmation.message}</span> : null
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

export default UEdit;