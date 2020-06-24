import React, { Component } from 'react';
import axios from 'axios';
import {Divider, Button, Header} from 'semantic-ui-react';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";


class Dashboard extends Component {

    state = {
        got_response: false,
    }


    componentDidMount() {

            axios({
                url: "/projects/?deployed=false", //TEST TO SEE WHETHER AUTHORIZATION IS WORKING OR NOT, APPARENTLY NOT
                method: 'get',
                withCredentials: true,

            }).then((response) => {
                    this.setState({
                        got_response: true
                    });

                    console.log(response.data);
                    let projects_list = response.data;
                    let i = 0;
                    for (let project in projects_list) {
                        console.log(projects_list[project])
                        let col = "" + (i % 4 + 1);
                        i = i + 1;

                        let parentDiv = document.getElementById("current-col-" + col)

                        let card = document.createElement('div');
                        card.className = "ui link items";

                        let card_item_div= document.createElement('div');
                        // card_item.className = "ui item";

                        let link_slug = 'http://localhost:3000/projects/' + projects_list[project]["slug"];
                        let card_item = document.createElement('a');
                        card_item.href = link_slug;
                        card_item.className = "ui item";

                        let segment = document.createElement('div');
                        segment.className = "ui red segment";

                        let proj_img = document.createElement('img');
                        proj_img.className = "ui massive image";
                        // proj_img.src = "https://static.scientificamerican.com/sciam/cache/file/D059BC4A-CCF3-4495-849ABBAFAED10456_source.jpg?w=590&h=800&526ED1E1-34FF-4472-B348B8B4769AB2A1";
                        proj_img.src = projects_list[project]["image"];


                        let proj_name = document.createElement('div');
                        proj_name.className = "ui large header";
                        proj_name.innerHTML = "<a class=\"a\" href=" + link_slug + ">" + projects_list[project]["title"] + "</a>";

                        //REPLACE WIKI WITH LINK TO PROJECT?
                        card_item_div.appendChild(proj_img);
                        card_item_div.appendChild(proj_name);
                        card_item.appendChild(card_item_div);
                        card.appendChild(card_item);
                        segment.appendChild(card);

                        parentDiv.appendChild(segment);

                        // console.log(project);
                    }

                }
            );

            axios({
                url: "/projects/?deployed=true", //TEST TO SEE WHETHER AUTHORIZATION IS WORKING OR NOT, APPARENTLY NOT
                method: 'get',
                withCredentials: true,

            }).then((response) => {
                    this.setState({
                        got_response: true
                    });

                    console.log(response.data);
                    let projects_list = response.data;
                    let i = 0;
                    for (let project in projects_list) {
                        let col = "" + (i % 4 + 1);
                        i = i + 1;

                        let parentDiv = document.getElementById("deployed-col-" + col)

                        let card = document.createElement('div');
                        card.className = "ui link items";

                        let card_item_div= document.createElement('div');
                        // card_item.className = "ui item";

                        let link_slug = 'http://localhost:3000/projects/' + projects_list[project]["slug"];
                        let card_item = document.createElement('a');
                        card_item.href = link_slug;
                        card_item.className = "ui item";

                        let segment = document.createElement('div');
                        segment.className = "ui green segment";

                        let proj_img = document.createElement('img');
                        proj_img.className = "ui massive image";
                        proj_img.src = projects_list[project]["image"];

                        let proj_name = document.createElement('div');
                        proj_name.className = "ui large header";
                        proj_name.innerHTML = "<a class=\"a\" href=" + link_slug + ">" + projects_list[project]["title"] + "</a>";

                        //REPLACE WIKI WITH LINK TO PROJECT?
                        card_item_div.appendChild(proj_img);
                        card_item_div.appendChild(proj_name);
                        card_item.appendChild(card_item_div);
                        card.appendChild(card_item);
                        segment.appendChild(card);

                        parentDiv.appendChild(segment);

                        // console.log(project);
                    }

                }
            );


    }

    // <div className="ui red segment">
    //     <img className="ui massive image" src="https://static.scientificamerican.com/sciam/cache/file/D059BC4A-CCF3-4495-849ABBAFAED10456_source.jpg?w=590&h=800&526ED1E1-34FF-4472-B348B8B4769AB2A1"></img>
    //     <div className="ui large header">ProjectName</div>
    //     <div className="sub header">Project wiki</div>
    // </div>

    render() {

        return (
            <div className="my-page">
                <MyNavBar/>

                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu">
                            <div className="left-menu-list">
                                <Link to="/dashboard" className="active item">
                                    Dashboard
                                </Link>
                                <Link to="/dashboard" className="item">
                                    My Page
                                </Link>
                            </div>

                        </div>

                        <div className="my-content">
                            <div style={{marginTop: "20px"}}>
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignContent: "flex-end",
                                    justifyContent: "space-between"
                                }}>
                                  <div style={{display: "flex", flexDirection:"column", justifyContent: "flex-end"}}>
                                      <div className="ui large header">Dashboard</div>
                                  </div>
                                  <Link to="/add">
                                    <Button id="add-proj" className="ui inverted violet labeled icon button">
                                        <i className="fitted plus icon"></i>
                                        <p className="my-button-text-size">Add Project</p>
                                    </Button>
                                  </Link>
                                </div>

                                <Divider></Divider>
                            </div>

                            <Header as={'h3'} style={{marginBottom:"5px", marginTop:"5px"}}>Current Projects:</Header>
                            <div className="ui grid">
                                <div className="four wide column" id="current-col-1"></div>
                                <div className="four wide column" id="current-col-2"></div>
                                <div className="four wide column" id="current-col-3"></div>
                                <div className="four wide column" id="current-col-4"></div>
                            </div>

                            <Header as={'h3'} style={{marginBottom:"5px", marginTop:"25px"}}>Deployed Projects:</Header>
                            <div className="ui grid">
                                <div className="four wide column" id="deployed-col-1"></div>
                                <div className="four wide column" id="deployed-col-2"></div>
                                <div className="four wide column" id="deployed-col-3"></div>
                                <div className="four wide column" id="deployed-col-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;