import React, {Component} from 'react';
import { Route,Switch } from 'react-router-dom';
import axios from 'axios';

import { Nav,Index,Write,Show,Edit,User,Sign,UShow,UEdit,Login,NoMatch } from '../src/components';
import './App.scss'

class App extends Component {

    state = {
        loggedIn : false,
        username : null,
        userId : null,
    };

    componentDidMount() {
        this.getUser()
    }

    updateUser = (userObject) => {
        this.setState(userObject)
    };

    getUser(){
        axios.get('/home')
            .then(res => {
                if(res.data.user){
                    this.setState({
                        loggedIn :true,
                        username :res.data.user.username,
                        userId : res.data.user._id
                    })
                }else{
                    this.setState({
                        loggedIn : false,
                        username : null,
                        userId : null,
                    })
                }
            });
    }

    render() {
        const { loggedIn, username, userId} = this.state;
        return (
            <div className="App">
                <Nav updateUser={this.updateUser} loggedIn={loggedIn} username={username}/>
                <h1>MERN-Stack-Board</h1>
                <Switch>
                    <Route exact path={'/'} render={() => <Index loggedIn={loggedIn}/>}/>
                    <Route path={'/write'} component={Write} />
                    <Route path={'/show/:id'} render={ props => <Show {...props} userId={userId} loggedIn={loggedIn}/>}/>
                    <Route path={'/edit/:id'} component={Edit}/>
                    <Route path={'/users'} component={User}/>
                    <Route path={'/ushow/:username'} render={props => <UShow {...props} userId={userId} loggedIn={loggedIn}/>}/>
                    <Route path={'/uedit/:username'} component={UEdit}/>
                    <Route path={'/login'} render={() => <Login updateUser={this.updateUser}/>}/>
                    <Route path={'/signup'} component={Sign}/>
                    <Route component={NoMatch}/>
                </Switch>
            </div>
        );
    }
}

export default App;
