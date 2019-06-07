import './App.scss'

import React, {Component} from 'react';
import { Nav,Index,Write,Show,Edit,User,Sign,UShow,UEdit,Login } from '../src/components';
import { Route,Switch } from 'react-router-dom';
import axios from 'axios';

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
                console.log('Get user response: ');
                console.log(res.data);
                if(res.data.user){
                    console.log('Get user : There is a user saved in the server session: ');;
                    this.setState({
                        loggedIn :true,
                        username :res.data.user.username,
                        userId : res.data.user._id
                    })
                }else{
                    console.log('Get user : no user');
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
            <div>
                <Nav updateUser={this.updateUser} loggedIn={loggedIn} username={username}/>
                <h2>MERN-Board</h2>
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
                </Switch>
            </div>
        );
    }
}

export default App;
