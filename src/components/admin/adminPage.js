import React, { Component } from 'react';
import axios from 'axios';
import {
    Divider,
    Button,
    Table,
    Loader,
    Card,
    Image,
    Confirm,
    Header,

} from 'semantic-ui-react';
import MyNavBar from "../nav";
import {Link} from "react-router-dom";

import '../../styles/admin.css';
import {urlApiUsers, urlApiUserToggleBan, urlApiUserToggleStatus} from "../../urls";

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props, //user_data, user_id, is_admin, isMobile
            userList: null,
            status_loading_button: -1,
            ban_loading_button: -1,
            buttons_disabled: false,
            selected_user: -1,
        }
    }

    onWindowResize(){
        this.setState({ isMobile: window.innerWidth <= 480 });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        if(this.state.is_admin){
            this.getUsers();
        }
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

    getUsers(){
        axios({
            url: urlApiUsers(),
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                this.setState({
                    userList: response["data"]
                });
            }
        ).catch( (e) => {
            alert(e);
        });
    }

    userBanToggle(){
        let user_id = this.state.selected_user
        let url = urlApiUserToggleBan(user_id);
        this.setState({
            banConfirmOpen: false,
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
            } else if(response.data["status"] === "You cannot change your own status!") {
                this.setState({
                    buttons_disabled: false,
                    ban_loading_button: -1,
                });
                alert("You can't ban yourself, silly!");
            }else {
                alert(response.data["status"]);
            }
        }).catch((e)=>{
            alert(e);
        });
    }

    userStatusToggle(){
        let user_id = this.state.selected_user;
        let url = urlApiUserToggleStatus(user_id);
        this.setState({
            adminConfirmOpen: false,
            buttons_disabled: true,
            status_loading_button: user_id,
        });

        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            if(response.data["status"] === "Role updated"){
                window.location.reload();
            } else if(response.data["status"] === "You cannot change your own status!") {
                this.setState({
                    buttons_disabled: false,
                    status_loading_button: -1,
                });
                alert("You can't demote yourself, silly!");
            }else {
                alert(response.data["status"]);
            }
        }).catch( (e) => {
            alert(e);
        });
    }

    render() {

        if(this.state.is_admin === false){
            return(
                <div className="my-page">
                    <MyNavBar user_data={this.state.user_data} isMobile={this.state.isMobile}/>

                    <div className="my-container">
                        <div className='my-container-inner'>
                            <div className="ui secondary vertical large menu left-menu-list">
                                <div>
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

        if(this.state.userList === null){
            return(<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);
        }

        if(this.state.isMobile){
            return (
                <div className="my-page">
                    <MyNavBar user_data={this.state.user_data} isMobile={this.state.isMobile}/>
                    <Confirm
                        open={this.state.banConfirmOpen}
                        onCancel={() => {this.setState({banConfirmOpen: false})}}
                        onConfirm={() => {this.userBanToggle()}}
                        cancelButton="No"
                        confirmButton="Yes"
                        />
                    <Confirm
                        open={this.state.adminConfirmOpen}
                        onCancel={() => {this.setState({adminConfirmOpen: false})}}
                        onConfirm={() => {this.userStatusToggle()}}
                        cancelButton="No"
                        confirmButton="Yes"
                        />
                    <div className="my-container">
                        <div className='my-container-inner'>
                            <div className="my-content">
                                <div className="ui large header admin-header">Admin Page</div>{/* index.css */}
                                <Divider/>
                                {!this.state.userList && <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>}
                                {this.state.userList  &&
                                     <Card.Group>
                                        { this.state.userList.map( (user, index) => {
                                            return (
                                                <Card
                                                    key={index}
                                                    fluid
                                                    color={user["is_superuser"] ? "black" : "blue"}
                                                >
                                                  <Card.Content>
                                                      <div className="admin-list-card"> {/* admin.css */}
                                                          <div className="admin-list-card-left"> {/* admin.css */}
                                                              <Image alt="ProfilePicture" circular size={"tiny"} src={user["display_picture"]}/>
                                                          </div>
                                                          <div className="admin-list-card-right"> {/* admin.css */}
                                                              <div className="admin-card-header">
                                                                  <Header as="h4" style={{margin:"0px"}}>{user["full_name"]}</Header> {/* admin.css */}
                                                                  {/*<Modal size={"large"} style={{width:"90%"}} closeIcon trigger={<Icon name={"edit"}/>}>*/}
                                                                  {/*  <Modal.Header>{user["full_name"]}</Modal.Header>*/}
                                                                  {/*  <Modal.Content>*/}
                                                                  {/*    <Modal.Description style={{display:"flex", flexDirection:"column"}}>*/}
                                                                  {/*      <Checkbox label="Banned" style={{marginBottom:"5px"}}/>*/}
                                                                  {/*      <Checkbox label="Admin"/>*/}
                                                                  {/*    </Modal.Description>*/}
                                                                  {/*  </Modal.Content>*/}
                                                                  {/*</Modal>*/}
                                                              </div>
                                                              {/*<span style={{fontWeight: "normal", fontSize:"0.9em"}}>{user["email"]}</span>*/}
                                                              {user["banned"] && <span style={{marginBottom:"3px", fontWeight: "bolder", fontSize:"0.9em", color:"red"}}>Banned</span>}
                                                              {!user["banned"] && <span style={{marginBottom:"3px", fontWeight: "bolder", fontSize:"0.9em", color:"blue"}}>{(user["is_superuser"]) ? 'Admin' : 'User'}</span>}
                                                              <div className="my-horizontal-div">
                                                                  <Button
                                                                    onClick={() => {this.setState({ banConfirmOpen: true, selected_user: user["pk"]  })}}
                                                                    disabled={this.state.buttons_disabled}
                                                                    loading={this.state.ban_loading_button === user["pk"]}
                                                                    color={ user["banned"] ? "green" : "red"}
                                                                    content={ user["banned"] ? "Enable" : "Disable"}
                                                                    size={"mini"}
                                                                />
                                                                <Button
                                                                    onClick={() => {this.setState({ adminConfirmOpen: true, selected_user: user["pk"]  })}}
                                                                    color={"blue"}
                                                                    disabled={this.state.buttons_disabled}
                                                                    loading={this.state.status_loading_button === user["pk"]}
                                                                    content={(user["is_superuser"]) ? "Demote to User" : "Promote to Admin"}
                                                                    size={"mini"}
                                                                />
                                                              </div>
                                                            </div>
                                                        </div>
                                                  </Card.Content>
                                                </Card>
                                            );
                                        })}
                                    </Card.Group>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        return (
            <div className="my-page">
                <Confirm
                    open={this.state.banConfirmOpen}
                    onCancel={() => {this.setState({banConfirmOpen: false})}}
                    onConfirm={() => {this.userBanToggle()}}
                    cancelButton="No"
                    confirmButton="Yes"
                    />
                <Confirm
                    open={this.state.adminConfirmOpen}
                    onCancel={() => {this.setState({adminConfirmOpen: false})}}
                    onConfirm={() => {this.userStatusToggle()}}
                    cancelButton="No"
                    confirmButton="Yes"
                    />
                <MyNavBar user_data={this.state.user_data} isMobile={this.state.isMobile}/>
                <Confirm
                    id="disable-enable-confirm"
                    open={this.state.disable_enable_confirm_open}
                    cancelButton='No'
                    confirmButton="Yes"
                    onCancel={() => {this.setState({confirm_open: false,})}}
                    onConfirm={this.userBanToggle.bind(this)}
                />
                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu left-menu-list">
                            <div>
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
                                <Table basic='very' collapsing padded className="admin-table">{/* index.css */}
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
                                                            onClick={() => {this.setState({ banConfirmOpen: true, selected_user: user["pk"]  })}}
                                                            disabled={this.state.buttons_disabled}
                                                            loading={this.state.ban_loading_button === user["pk"]}
                                                            color={ user["banned"] ? "green" : "red"}
                                                            content={ user["banned"] ? "Enable" : "Disable"}
                                                            size={"small"}
                                                        />
                                                </Table.Cell>
                                                <Table.Cell>
                                                        <Button
                                                            onClick={() => {this.setState({ adminConfirmOpen: true, selected_user: user["pk"]  })}}
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