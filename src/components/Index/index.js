import React, {Component} from 'react';
import {Table, ButtonToolbar, Button, InputGroup, FormControl} from "react-bootstrap";
import axios from 'axios';
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";

import TableItem from './tableItem';
import './index.scss';
import Page from '../Page/page';

class Index extends Component {

    state = {
        board : [],
        keyword : '',
    };

    componentDidMount(){
        axios.get('/board')
            .then(res => this.setState({ board : res.data }))
            .catch(err => console.log(err))
    }

    handlePage = (number) => {
        axios.get('/board?page=' + number)
            .then(res => this.setState({ board : res.data }))
            .catch(err => console.log(err))
    };

    handleSearch = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    ClickSearch = () => {
        const { keyword } = this.state;
        if(keyword == null || keyword == ''){
            return alert("검색어를 입력 해주세요 !")
        }
        const obj = {
            keyword : keyword
        };
        axios.post('/board/search',obj)
            .then(res => this.setState({ board : res.data }))
            .catch(err => console.log(err));
    };

    render() {
        const { board,keyword } = this.state;
        const { loggedIn } = this.props;
        const { handlePage,handleSearch } = this;

        const boardList = ( board.length === 0 ) ? <TableItem obj={null} />
            : board.result.map(
                (boardItem,index) => (
                    <TableItem
                        obj={boardItem} key={index}
                    />
                )
            );

        const PL = [];

            for(let i=1; i <= board.pageNum; i++){
                PL.push(<Page key={i} num={i} onClick={handlePage}/>)
            }

        return (
            <div className="Index">
                <Table responsive style={{tableLayout:"fixed"}}>
                    <thead>
                    <tr className="tr_center">
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>View</th>
                    </tr>
                    </thead>
                    <tbody>
                        {boardList}
                    </tbody>
                </Table>
                    <div className="pagination">
                        {PL}
                    </div>
                    <InputGroup className="mb-3" style={{width:"30%",margin:"0 0 0 auto"}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><MdSearch style={{fontSize:"1.5rem"}}/></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder = "제목 or 내용"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            type="text" id="keyword" name="keyword" value={keyword} onChange={handleSearch}/>
                        <Button onClick={this.ClickSearch} variant="primary" className="search_btn">검색</Button>
                    </InputGroup>
                <ButtonToolbar>
                    {
                        (loggedIn) ?
                        <Button variant="success" style={{marginBottom:"30px"}}>
                            <Link to={'/write'} className="write">글쓰기</Link>
                        </Button> : <div className="login-error">로그인을 해야 글 작성을 할 수 있습니다.</div>
                    }
                </ButtonToolbar>
            </div>
        );
    }
}

export default Index;