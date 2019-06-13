import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

import './page.scss';

class Page extends Component {
    render() {
        const { onClick,num } = this.props;
        return (
            <div className="Page">
                <NavLink to={"#"} onClick={() => onClick(num)} className="page_num">{num}</NavLink>
            </div>
        );
    }
}

export default Page;