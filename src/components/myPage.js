import React, { Component } from 'react';
import axios from 'axios';
import {Divider, Button, Header, Loader, Menu} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import MyReports from "./myReports";
import MyAssignments from "./myAssignments";


class MyPage extends Component {

    state = {
        user_id: null,
        activeMenuItem: "my-reports",
    }


    componentDidMount() {
        axios({
            url: "/users/test/",
            method: "get",
            withCredentials: true,

         }).then((response) => {
            // console.log(response.data["pk"]);
             this.setState({
                user_id: response.data["pk"],
                got_user: true,
            });
         });
    }

    render() {

        if(this.state.user_id === null){

            return (<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);

        }

        return (
            <div className="my-page">
                <MyNavBar/>

                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu">
                            <div className="left-menu-list">
                                <Link to="/dashboard" className="item">
                                    Dashboard
                                </Link>
                                <Link to="/mypage" className="active item">
                                    My Page
                                </Link>
                            </div>

                        </div>

                        <div className="my-content">
                            <div style={{marginTop: "30px"}}>
                                <Menu pointing secondary>
                                    <Menu.Item
                                        name="my-reports"
                                        active={this.state.activeMenuItem === "my-reports"}
                                        onClick={() => {
                                            this.setState({
                                                activeMenuItem: "my-reports"
                                            });
                                        }}
                                    />
                                    <Menu.Item
                                        name="my-assignments"
                                        active={this.state.activeMenuItem === "my-assignments"}
                                        onClick={() => {
                                            this.setState({
                                                activeMenuItem: "my-assignments"
                                            });
                                        }}
                                    />
                                </Menu>
                            </div>

                            { this.state.activeMenuItem === "my-reports" && <MyReports user_id={this.state.user_id}/>}
                            { this.state.activeMenuItem === "my-assignments" && <MyAssignments user_id={this.state.user_id}/>}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyPage;