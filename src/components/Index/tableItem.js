import React, {Component,Fragment} from 'react';
import { Link } from "react-router-dom";
import Moment from 'react-moment';

import './tableItem.scss';

class TableItem extends Component {
    render() {
        const { obj } = this.props;
        return (
            <Fragment>
                {
                (obj === null || obj.length === 0)
                     ?
                    <tr>
                        <td>게시글이 없습니다.</td>
                    </tr>
                    :
                        <tr>
                            <td>
                                <Link to={"/show/" + obj._id} style={{textDecoration:"none"}} className="ellipsis">{obj.title}</Link>
                            </td>
                            <td className="td_center">
                                {
                                    (obj.author) ?
                                        <Fragment><span className="ellipsis">{obj.author.username}</span></Fragment>
                                        : ""
                                }
                            </td>
                            <td className="td_center">
                                <Moment format="YYYY-MM-DD">
                                    {obj.createdAt}
                                </Moment>
                            </td>
                            <td className="td_center">
                                {obj.count}
                            </td>
                        </tr>
                }
            </Fragment>
        );
    }
}

export default TableItem;