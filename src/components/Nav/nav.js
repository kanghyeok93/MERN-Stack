import React, {Component,Fragment} from 'react';
import { Container,Navbar,Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from "axios";

import './nav.scss';

class Navs extends Component {

    logout = (e) => {
        e.preventDefault();
        axios.post('/logout').then(res => {
            if(res.status === 200){
                this.props.updateUser({
                    loggedIn : false,
                    username : null
                })
            }
        }).catch(err => console.log('Logout err'))
    };
    render() {
        const { loggedIn,username } = this.props;

        return (
            <Container style={{boxShadow:"0 1px 10px rgba(0,0,0,0.3)",background:"brown"}}>
                <Navbar expand="lg" variant="light" bg="white" >
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <NavLink to={"/"} className="NavLink">S K H</NavLink>
                        <Nav className="mr-auto justify-content-end" style={{ width: "90%" }}>
                            {
                                    (loggedIn)
                                    ?
                                    <Fragment>
                                        <NavLink className="NavLink" to={'/ushow/' + username}>My Account</NavLink>
                                        <NavLink to={'#'} className="NavLink" onClick={this.logout}>Logout</NavLink>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <NavLink to={"/signup"} className="NavLink">Sign up</NavLink>
                                        <NavLink to={"/login"} className="NavLink">Login</NavLink>
                                    </Fragment>

                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        );
    }
}

export default Navs;
