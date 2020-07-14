import React, { Component } from 'react';
import axios from 'axios';
import {Header, Loader, Menu} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import MyReports from "./myReports";
import MyAssignments from "./myAssignments";
import Dashboard from "./dashboard";



class MyPage extends Component {

    constructor(props) {
        super(props);
        let params = new URLSearchParams(window.location.search);
        let show="my-reports";
        if(params.get('show') !== null){
            if(params.get('show') === "my-assignments"){
                show = "my-assignments";
            }
        }
        let initial_state = this.props; //user_data, user_id, isMobile
        let append_state = {
            activeMenuItem: show,
        }
        this.state = {...initial_state, ...append_state};
    }


    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
      if(this.props["isMobile"] !== prevProps["isMobile"])
      {
        this.setState({
            ...this.state,
            ...this.props
        })
      }
    }

    render() {

        if(this.state.user_id === null){
            return (<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);
        }

        return (
            <div className="my-page">
                <MyNavBar user_data={this.state.user_data} isMobile={this.state.isMobile}/>
                <div className="dashboard-mobile-header-container"><Header className="dashboard-mobile-header">My Page</Header></div>
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