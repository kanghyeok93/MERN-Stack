import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import './u_index.scss'

class UTableItem extends Component {
    render() {
        const {obj} = this.props;
        return (
            <div>
                <Link to={'/ushow/' + obj.username} className="u_table_item">{obj.username}</Link>
            </div>
        );
    }
}

export default UTableItem;