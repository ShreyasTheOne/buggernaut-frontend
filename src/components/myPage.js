import React, { Component } from 'react';
import axios from 'axios';
import {Loader, Menu} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import MyReports from "./myReports";
import MyAssignments from "./myAssignments";
import queryString from "query-string";


class MyPage extends Component {

    constructor(props) {
        super(props);
        let url = this.props.location.search;
        let params = queryString.parse(url);
        let show="my-reports";
        if(params['show'] !== null){
            if(params['show'] === "my-assignments"){
                show = "my-assignments";
            }
        }
        this.state = {
             user_id: null,
            activeMenuItem: show,
        }
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
         }).catch( (e) => {
            alert(e);
         });
    }

    render() {

        if(this.state.user_id === null){

            return (<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);

        }

        return (
            <div className="my-page">
                <MyNavBar/>

                <div className="my-container"> {/* index.css */}
                    <div className='my-container-inner'> {/* index.css */}
                        <div className="ui secondary vertical large menu left-menu-list">
                            <div> {/* index.css */}
                                <Link to="/dashboard" className="item">
                                    Dashboard
                                </Link>
                                <Link to="/mypage" className="active item">
                                    My Page
                                </Link>
                            </div>
                         </div>

                        <div className="my-content"> {/* index.css */}
                            <div className="my-page-menu-container">
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