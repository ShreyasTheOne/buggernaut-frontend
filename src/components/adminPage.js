import React, { Component } from 'react';
import axios from 'axios';
import {Divider, Button, Header, Menu, Table, Loader, Card, Image, Icon, Popup, Dropdown} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import ProjectsList from "./projectsList";
import AddProject from "./addProject";


class AdminPage extends Component {

    state = {
        userList: null,
        activeMenuItem: "current-projects",
    }


    componentDidMount() {
        axios({
            url: '/users',
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                this.setState({
                    userList: response["data"]
                });
            }
        );
    }

    banUser(user_id){
        //ADD BAN USER FIELD
    }

    userStatusToggle(user_id){
        console.log(user_id);
        let url = "/users/"+user_id+"/toggleStatus";
        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            window.location.reload();
        });
    }

    render() {

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
                                <Link to="/mypage" className="item">
                                    My Page
                                </Link>
                            </div>
                        </div>

                        <div className="my-content">
                            <div style={{marginTop: "20px"}}>
                                <div className="ui large header">Admin Page</div>
                                <Divider/>
                            </div>

                            {this.state.userList === null && <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>}
                            {this.state.userList !== null &&
                                <Table basic='very' collapsing padded style={{width:"50%"}}>
                                <Table.Header>
                                  <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                  </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.userList.map( (user, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{user["full_name"]}</Table.Cell>
                                                <Table.Cell>{(user["is_superuser"] && "Admin") || "User"}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="admin-action-icons">
                                                        <Icon
                                                            name="ban"
                                                            onClick={() => {
                                                                this.banUser(user["pk"]);
                                                            }}
                                                            className={"ban-icon"}
                                                            size={"large"}/>

                                                        {user["is_superuser"] &&
                                                            <Popup
                                                                inverted
                                                                size={"mini"}
                                                                content="Demote to User"
                                                                position='bottom center'
                                                                trigger={
                                                                    <Icon
                                                                        onClick={() => {this.userStatusToggle(user["pk"]);}}
                                                                        name="angle double down"
                                                                        size={"large"}
                                                                        className={"ban-icon"}/>}
                                                            />
                                                        }
                                                        {!user["is_superuser"] &&
                                                            <Popup
                                                                inverted
                                                                size={"mini"}
                                                                content="Promote to Admin"
                                                                position='bottom center'
                                                                trigger={<Icon
                                                                    onClick={() => {this.userStatusToggle(user["pk"]);}}
                                                                    name="angle double up"
                                                                    size={"large"}
                                                                    className={"ban-icon"}/>}
                                                            />
                                                        }
                                                    </div>
                                                </Table.Cell>

                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                              </Table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPage;