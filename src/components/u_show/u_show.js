import React, {Component} from 'react';
import {Button,ButtonToolbar ,Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import { Link } from 'react-router-dom';

import './u_show.scss';

class UShow extends Component {

    state = {
        showItem : {
            name : '',
            email : '',
        }
    };

    componentDidMount() {
        axios.get('/user/show/' + this.props.match.params.username)
            .then(res => this.setState({ showItem : res.data }))
            .catch(err => console.log(err));
    }

    render() {
        const { userId, loggedIn } = this.props;
        const { username } = this.props.match.params;
        const { showItem } = this.state;
        return (
            <div className="u_show">
                <Form>
                    <ButtonToolbar>
                        <Link to={'/users'} className="usb"><Button variant="danger">Back</Button></Link>
                        {
                            (loggedIn && userId === showItem._id) ?
                                <Link to={'/uedit/' + username} style={{marginLeft:"20px"}}><Button variant="info">Edit</Button></Link>
                                : null
                        }
                    </ButtonToolbar>
                    <h3 style={{margin:"30px 0 30px 0"}}>{username}</h3>
                    <fieldset disabled>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} htmlFor="name">
                            Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" id="name" name="name" defaultValue={showItem.name} />
                        </Col>
                    </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm={2} htmlFor="email">
                                Email
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" id="email" name="email" defaultValue={showItem.email} />
                            </Col>
                        </Form.Group>
                    </fieldset>
                   </Form>
            </div>
        );
    }
}

export default UShow;