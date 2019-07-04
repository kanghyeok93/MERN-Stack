import React, {Component} from 'react';

import './NoMatch.scss';

class NoMatch extends Component {

    onClick = () => {
        this.props.history.push('/');
    };

    render() {

        const { onClick } = this;

        return (
            <div className="NoMatch">
                <h5>페이지의 요청이 잘못되었습니다.</h5>
                <h5>404 not found</h5>
                <div className="errpage">
                    <button onClick={onClick} className="err-btn">돌아가기</button>
                </div>
            </div>
        );
    }
}

export default NoMatch;