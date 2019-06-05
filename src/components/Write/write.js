import React, {Component} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios'

import './write.scss'

class Write extends Component {

    state ={
        title : '',
        body : '',
        errors : '',
    };

    componentDidMount() {
        axios.get('/board/write')
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    onSubmit = (e) => {
        const{ title, body } = this.state;
        e.preventDefault();

        const obj = {
            title : title,
            body : body
        };

        axios.post('/board/add',obj)
            .then(res => this.setState({
                errors : res.data,
            }));
    };

    render() {
        const { title,body,errors } = this.state;
        const { onSubmit,handleChange } = this;

        if(errors === 'Add complete'){
            // setTimeout(()=> {
                this.props.history.push('/');
            // },1000);
        }
        return (
            <div className="form">
                <h2 className="W_h2">글 작성</h2>
                <Button variant="danger" style={{marginBottom:30}}>
                    <NavLink to={'/'} className="W_NavLink">Back</NavLink>
                </Button>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" onChange={handleChange} value={title} />
                        {
                            (errors.title) ? <span className="write_error">{errors.title.message}</span> : null
                        }
                    </Form.Group>
                    <Form.Group controlId="body">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows="3" name="body" onChange={handleChange} value={body}/>
                        {
                            (errors.body) ? <span className="write_error">{errors.body.message}</span> : null
                        }
                    </Form.Group>
                    <Button variant="success" style={{margin:"15px 0 50px 0"}} type="submit">Submit</Button>
                    {
                        (errors.unhandled) ? <Alert variant="danger">{errors.unhandled}</Alert> : null
                    }
                </Form>
            </div>
        );
    }
}

export default Write;