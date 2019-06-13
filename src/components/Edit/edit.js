import React, {Component} from 'react';
import axios from 'axios';
import {Form, ButtonToolbar, Button, Alert} from "react-bootstrap";
import {Link} from "react-router-dom";

import './edit.scss';

class Edit extends Component {

    state = {
        title : '',
        body : '',
        errors : '',
    };

    componentDidMount() {
        const { match } = this.props;
        axios.get('/board/edit/' + match.params.id )
            .then(res => {
                this.setState({
                    title : res.data.post.title,
                    body : res.data.post.body,
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
        const { title, body } = this.state;
        e.preventDefault();

        const obj = {
            title : title,
            body : body,
        };

        axios.post('/board/update/' + this.props.match.params.id, obj)
            .then(res => this.setState({
                errors : res.data,
            }));
    };

    render() {
        const { title, body,errors } = this.state;
        const { onChange,onSubmit } = this;

        if(errors === 'Update complete'){
                this.props.history.push('/show/' + this.props.match.params.id);
        }
        return (
            <div className="Edit">
                <ButtonToolbar>
                    <Link to={'/show/' + this.props.match.params.id} style={{marginBottom:30}}><Button variant="danger">Back</Button></Link>
                </ButtonToolbar>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="formGroupText">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" onChange={onChange} value={title}/>
                        {
                            (errors.title) ? <span className="edit_error">{errors.title.message}</span> : null
                        }
                    </Form.Group>
                    <Form.Group controlId="formGroupText">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows="3" name="body" onChange={onChange} value={body}/>
                        {
                            (errors.body) ? <span className="edit_error">{errors.body.message}</span> : null
                        }
                    </Form.Group>
                    <ButtonToolbar>
                        <Button variant="success" type="submit">Update</Button>
                    </ButtonToolbar>
                    {
                        (errors.unhandled) ? <Alert variant="danger">{errors.unhandled}</Alert> : null
                    }
                </Form>
            </div>
        );
    }
}

export default Edit;