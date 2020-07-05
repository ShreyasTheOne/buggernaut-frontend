import React, { Component } from 'react';
import axios from 'axios';
import {Header, Menu} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import ProjectsList from "./projectsList";
import AddProject from "./addProject";


class Dashboard extends Component {

    state = {
        got_response: false,
        deployed_projects: null,
        current_projects: null,
        activeMenuItem: "current-projects",
        veryMobile: (window.innerWidth <= 410),
    }

    onWindowResize(){
        this.setState({ veryMobile: window.innerWidth <= 410 });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        axios({
            url: "/projects/?deployed=false", //TEST TO SEE WHETHER AUTHORIZATION IS WORKING OR NOT, APPARENTLY NOT
            method: 'get',
            withCredentials: true,

        }).then((response) => {
                this.setState({
                    current_projects: response.data ,
                });
            }
        ).catch( (e) => {
            alert(e);
        });

        axios({
            url: "/projects/?deployed=true", //TEST TO SEE WHETHER AUTHORIZATION IS WORKING OR NOT, APPARENTLY NOT
            method: 'get',
            withCredentials: true,
        }).then((response) => {
                this.setState({
                    deployed_projects: response.data,
                });
            }
        ).catch( (e) => {
            alert(e);
        });


    }

    render() {

        return (
            <div className="my-page">
                <MyNavBar/>
                <div className="dashboard-mobile-header-container"><Header className="dashboard-mobile-header">Dashboard</Header></div>
                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu left-menu-list">
                            <div>
                                <Link to="/dashboard" className="active item">
                                    Dashboard
                                </Link>
                                <Link to="/mypage" className="item">
                                    My Page
                                </Link>
                            </div>

                        </div>

                        <div className="my-content">
                            <div className="dashboard-content">{/* index.css */}

                                    <Menu pointing secondary >{/* index.css */}
                                        <Menu.Item
                                            name={(this.state.veryMobile && "current") || "current-projects"}
                                            active={this.state.activeMenuItem === "current-projects"}
                                            onClick={() => {
                                                this.setState({
                                                    activeMenuItem: "current-projects"
                                                });
                                            }}
                                        />
                                        <Menu.Item
                                            name={(this.state.veryMobile && "deployed") || "deployed-projects"}
                                            active={this.state.activeMenuItem === "deployed-projects"}
                                            onClick={() => {
                                                this.setState({
                                                    activeMenuItem: "deployed-projects"
                                                });
                                            }}
                                        />
                                        <Menu.Menu position="right">
                                            <Menu.Item
                                              name={(this.state.veryMobile && "add") || "add-project"}
                                              active={this.state.activeMenuItem === 'add-project'}
                                              onClick={() => {
                                                    this.setState({
                                                        activeMenuItem: "add-project"
                                                    });
                                                }}
                                            />
                                        </Menu.Menu>
                                    </Menu>

                                {this.state.activeMenuItem === "current-projects" && <ProjectsList project_status="current"/>}
                                {this.state.activeMenuItem === "deployed-projects" && <ProjectsList project_status="deployed"/>}
                                {this.state.activeMenuItem === "add-project" && <AddProject/>}

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;