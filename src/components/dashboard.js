import React, { Component } from 'react';
import axios from 'axios';
import { Header,  Divider} from 'semantic-ui-react';


class Dashboard extends Component {

    componentDidMount() {

        axios({

            url: "http://localhost:8000/projects/?deployed=false", //TEST TO SEE WHETHER AUTHORIZATION IS WORKING OR NOT, APPARENTLY NOT
            method: 'get',

            withCredentials: true,

        }).then((response) => {
                console.log(response.data);
                let projects_list = response.data;
                let i = 0;
                for(let project in projects_list){
                    let col = ""+(i%4 + 1);
                    i = i+1;
                    let parentDiv = document.getElementById("current-col-"+col)

                    let card = document.createElement('div');
                    card.className = "ui red segment";

                    let proj_img = document.createElement('img');
                    proj_img.className="ui massive image";
                    proj_img.src="https://static.scientificamerican.com/sciam/cache/file/D059BC4A-CCF3-4495-849ABBAFAED10456_source.jpg?w=590&h=800&526ED1E1-34FF-4472-B348B8B4769AB2A1";

                    let proj_name = document.createElement('div');
                    proj_name.className="ui large header";
                    proj_name.innerText=projects_list[project]["title"];

                    let proj_wiki = document.createElement('div');
                    proj_wiki.className="sub header";
                    proj_wiki.innerText=projects_list[project]["wiki"];

                    card.appendChild(proj_img);
                    card.appendChild(proj_name);
                    card.appendChild(proj_wiki);

                    parentDiv.appendChild(card);

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


        // let aas = document.cookie.split(';');
        // console.log(aas);

        return (
        <div className="my-page">
            <div className="app-logo">

            </div>
            <div className="my-nav">
                    <div className='buggernaut-title'>
                        <div className='ui large header'>Buggernaut</div>
                    </div>
                    <div className='my-icon-nav-links'>
                            <i className="grey bell large icon"></i>
                            <i className="grey setting large icon"></i>
                            <i className="grey power off large icon"></i>
                    </div>
            </div>
            <div className="my-container">
                <div className='my-container-inner'>
                     <div className="ui secondary vertical huge menu">
                        <div className="left-menu-list">
                            <a className="active item">
                                Dashboard
                            </a>
                            <a className="item huge ">
                                My Page
                            </a>
                        </div>

                    </div>

                    <div className="my-content">
                        <div style={{marginTop: "20px"}}>
                            <Header as='h1' size='huge'>Dashboard</Header>
                            <Divider></Divider>
                        </div>

                        <div className="ui grid">
                            <div className="four wide column" id="current-col-1"></div>
                            <div className="four wide column" id="current-col-2"></div>
                            <div className="four wide column" id="current-col-3"></div>
                            <div className="four wide column" id="current-col-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            );
    }
}

export default Dashboard;