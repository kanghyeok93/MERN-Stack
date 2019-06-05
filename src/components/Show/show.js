import React, {Component, Fragment} from 'react';
import { ButtonToolbar,Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';

import './show.scss';

class Show extends Component {

      state = {
          showItem : {}
      };

    componentDidMount() {
        axios.get('/board/show/' + this.props.match.params.id)
            .then(res => this.setState({ showItem : res.data }))
            .catch(err => console.log(err))
    }

    delete = () => {
        axios.get('/board/delete/' + this.props.match.params.id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

        // setTimeout(()=> {
            this.props.history.push('/');
        // },1000);
    };

    render() {
        const { match,loggedIn, userId} = this.props;
        const { showItem } = this.state;
        const view = (showItem.author) ? (loggedIn) && userId === showItem.author._id : "";
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
                        <div className="Show_body">
                            <p>{showItem.body}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Show;
