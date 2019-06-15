import React, {Component, Fragment} from 'react';
import {ButtonToolbar, Button, Form} from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';

import ReplyItems from './replyItems';
import './show.scss';

class Show extends Component {

      state = {
          showItem : {},
          comments : [],
          reply : '',
          errors : '',
      };

    componentDidMount() {
        axios.get('/board/show/' + this.props.match.params.id)
            .then(res => this.setState({ showItem : res.data, comments:res.data.comments }))
            .catch(err => console.log(err))
    }

    delete = () => {
        axios.get('/board/delete/' + this.props.match.params.id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

            setTimeout(() => {
                    this.props.history.push('/');
                },1000)
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    onSubmit = (e) => {
        const{ reply } = this.state;
        e.preventDefault();

        const obj = {
            reply : reply
        };

        axios.post('/board/reply/' + this.props.match.params.id,obj)
            .then(res => this.setState({
                errors : res.data,
            }));

        this.setState({
            reply : ''
        })
    };


    render() {
        const { match,loggedIn, userId} = this.props;
        const { showItem,reply,errors,comments } = this.state;

        const view = (showItem.author) ? (loggedIn) && userId === showItem.author._id : "";

        const replyList = (comments.length === 0 ) ? <ReplyItems obj={null}/>
              :   comments.map(
                    (replyItem,index) => (
                        <ReplyItems
                            obj={replyItem} match={match.params.id} key={index}
                            comments={comments} loggedIn={loggedIn} userId={userId}
                        />
                    )
                );

        if(errors === 'reply complete'){
            this.props.history.push('/');
        }

        return (
            <div className="Show">
                <ButtonToolbar>
                    <Link to={'/'}><Button variant="danger" style={{margin:"0px 5px"}}>Back</Button></Link>
                    {
                       (view) ?
                    <Fragment>
                        <Link to={'/edit/' + match.params.id}><Button variant="info" style={{margin:"0px 5px"}}>Edit</Button></Link>
                        <a onClick={() => window.confirm('게시글을 삭제하시겠습니까?') ? this.delete() : null}><Button variant="warning" style={{margin:"0px 5px",color:"white"}}>Delete</Button></a>
                    </Fragment>
                            : null
                    }
                </ButtonToolbar>
                <div className="Show_sub">
                    <h3><p>{showItem.title}</p></h3>
                    <div><span>작성자</span> : {
                        (showItem.author) ? <span className="author">{showItem.author.username}</span> : ""
                    }
                    </div>
                    <div>
                        <div className="Show_Date">
                            <span>Created</span> : <Moment format="YYYY-MM-DD HH:mm">{showItem.createdAt}</Moment>
                            {
                                (showItem.updatedAt) ?
                                    <div><span>Updated</span> : <Moment format="YYYY-MM-DD HH:mm">{showItem.updatedAt}</Moment></div> : null
                            }
                        </div>
                        <div className="Show_body" style={{marginBottom:"55px"}}>
                            {showItem.body}
                        </div>
                    </div>
                </div>
                <h2 className="C_h2" style={{marginBottom:"30px"}}>댓글 List</h2>
                <div className="reply_item">
                    {replyList}
                </div>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="reply">
                        <Form.Label style={{margin:"30px 0 10px 0"}}>댓글 작성</Form.Label>
                        <Form.Control type="text" name="reply" value={reply} onChange={this.handleChange}/>
                    </Form.Group>
                    {
                        (errors['comments.0.memo']) ? <span className="reply_error">{errors['comments.0.memo'].message}</span> : null
                    }
                    <ButtonToolbar>
                        {
                            (loggedIn) ?
                                <Button variant="success" style={{margin:"15px 0 50px 0"}} type="submit">Submit</Button>
                                : <div className="reply-com-error">로그인을 해야 댓글작성을 할 수 있습니다.</div>
                        }
                    </ButtonToolbar>
                </Form>
            </div>
        );
    }
}


export default Show;
