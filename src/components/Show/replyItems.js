import React, {Component, Fragment} from 'react';
import Moment from 'react-moment';
import {Button} from "react-bootstrap";
import axios from "axios";

import './replyItem.scss';

class ReplyItems extends Component {

    state = {
        msg : '',
    };

    delete = () => {
        axios.get('/board/reply/delete/' + this.props.obj._id + '/' + this.props.match)
            .then(res => this.setState({ msg : res.data }))
            .catch(err => console.log(err));
    };


    render() {
        const { obj } = this.props;
        const { msg } = this.state;

        if(msg === 'comment complete'){
            return window.location.href='/show/' +this.props.match;
        }

        if(msg === 'permission-error' || msg === 'login-error'){
             window.alert("작성자만 글을 삭제할 수 있습니다.");
            return window.location.href='/show/' +this.props.match;
        }

        return (
            <Fragment>
                {
                    (obj === null)
                        ?
                        <div style={{marginTop:"40px",fontSize:"1.1rem"}}>댓글이 없습니다.</div>
                        :
                        <div className="reply_Item">
                                    <a  onClick={() => window.confirm('댓글 삭제하시겠습니까?') ? this.delete() : null} className="reply_del">
                                        <Button variant="warning" style={{margin:"0px 5px",color:"white"}}>
                                            Delete
                                        </Button>
                                    </a>
                            <div className="reply_username">{obj.comAuthor.username}</div>
                            <Moment format="YYYY-MM-DD HH:mm" className="reply_date">
                                {obj.comCreatedAt}
                            </Moment>
                            <div className="reply_memo">{obj.memo}</div>
                        </div>

                }
            </Fragment>
        );
    }
}

export default ReplyItems;