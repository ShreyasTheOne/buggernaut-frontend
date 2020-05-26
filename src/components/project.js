import React, {Component} from 'react';
import axios from "axios";
import {Divider, Header} from "semantic-ui-react";

class Project extends Component {

    state = {
        project_found: false,
        project_name: null,
        project_wiki: null,
        got_response: false
    }

    componentDidMount() {
        const name=  this.props.match.params.slug;
        const url = "http://localhost:8000/projects/?slug="+name;
            axios({
               url: url,
               method: "get",
               withCredentials: true,
            }).then((response) => {
                console.log(response);
                let data = response.data;
                if(data.length === 0){
                    this.setState({
                        got_response: true,
                        project_found: false
                    });
                } else{
                    this.setState({
                        got_response: true,
                        project_found: true,
                        project_name: data[0]["title"],
                        project_wiki: data[0]["wiki"],

                    });
                }

                console.log(this.state)
            });


        this.setState({
           project_name: name
        });
    }

    render(){
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
                            <Header as='h1' size='huge'>{this.state.project_name}</Header>
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

export default Project;