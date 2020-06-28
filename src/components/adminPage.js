import React, { Component } from 'react';
import axios from 'axios';
import {Divider, Button, Header, Menu, Table, Loader, Card, Image, Icon, Popup, Dropdown} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import ProjectsList from "./projectsList";
import AddProject from "./addProject";


class AdminPage extends Component {

    state = {
        is_admin: null,
        userList: null,
        status_loading_button: -1,
        ban_loading_button: -1,
        buttons_disabled: false,

    }


    componentDidMount() {
        axios({
            url:"/users/test/",
            method: "get",
            withCredentials: true,
        }).then( (response) => {
            if(response.data["is_superuser"]){
                this.setState({
                    is_admin: true
                });
                this.getUsers();
            } else {
                this.setState({
                    is_admin: false
                });
            }
        }).catch( (e) => {
            alert(e);
        } );
    }

    getUsers(){
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

    userBanToggle(user_id){
        let del = window.confirm("Are you sure?");
        if(!del) return;

        //ADD BAN USER FIELD
        let url = "/users/"+user_id+"/toggleBan";
        this.setState({
            buttons_disabled: true,
            ban_loading_button: user_id,
        });
        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            if(response.data["status"] === "Status updated"){
                window.location.reload();
            } else {
                alert(response.data["status"]);
            }
        }).catch((e)=>{
            alert(e);
        });
    }

    userStatusToggle(user_id){
        let del = window.confirm("Are you sure?");
        if(!del) return;

        // console.log(user_id);
        let url = "/users/"+user_id+"/toggleStatus";
        this.setState({
            buttons_disabled: true,
            status_loading_button: user_id,
        });

        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            window.location.reload();
        });
    }

    render() {

        if(this.state.is_admin === null){
            return(<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);
        }

        if(this.state.is_admin === false){
            return(
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
                                {/*<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>*/}
                                <div className="not-admin-error-content">
                                        <div>Wait a minute, you're not an admin! <span aria-label="face with monocle" role="img" className="careful-emoji-inside">🧐</span> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>);
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
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell/>
                                  </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.userList.map( (user, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{user["full_name"]}</Table.Cell>
                                                <Table.Cell>{(user["is_superuser"] && "Admin") || "User"}</Table.Cell>
                                                <Table.Cell>
                                                        <Button
                                                            onClick={() => { this.userBanToggle(user["pk"]); }}
                                                            disabled={this.state.buttons_disabled}
                                                            loading={this.state.ban_loading_button === user["pk"]}
                                                            color={ user["banned"] ? "green" : "red"}
                                                            inverted
                                                            content={ user["banned"] ? "Enable" : "Disable"}
                                                            size={"small"}
                                                        />
                                                </Table.Cell>
                                                <Table.Cell>
                                                        <Button
                                                            onClick={() => {this.userStatusToggle(user["pk"]);}}
                                                            color={"blue"}
                                                            disabled={this.state.buttons_disabled}
                                                            loading={this.state.status_loading_button === user["pk"]}
                                                            content={(user["is_superuser"]) ? "Demote to User" : "Promote to Admin"}
                                                            size={"small"}
                                                        />
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