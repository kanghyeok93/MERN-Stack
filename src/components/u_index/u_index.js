import React, {Component} from 'react';
import axios from "axios";

import './u_index.scss';
import UtableItem from './u_tableItem';

class UIndex extends Component {

    state = {
        users : []
    };

    componentDidMount(){
        axios.get('/user')
            .then(res => this.setState({ users : res.data }))
            .catch(err => console.log(err))
    }

    render() {
        const { users } = this.state;
        const userList = users.map(
                (user,index) => (
                    <UtableItem
                        obj={user} key={index}
                    />
                )
            );
        return (
            <div className="U_index">
                <h3>Users</h3>
                {
                    (users === null || users.length ===0) ? <div>There is no user yet.</div>
                        : userList
                }
            </div>
        );
    }
}

export default UIndex;