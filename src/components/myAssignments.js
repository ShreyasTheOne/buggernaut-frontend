import React, { Component } from 'react';
import axios from 'axios';
import {Card, Loader, Label} from "semantic-ui-react";

class MyAssignments extends Component {

    constructor(props) {
        super(props);
        // console.log(this.props)
        let initial_state = this.props; //user_id
        let append_state = {
            issues: null,
            priority_colors: ["#FFFFFF", "#Ff0000", "#FFE500", "#5ee339"],
        };
        this.state = {...initial_state, ...append_state};
    }


    componentDidMount() {
        this.getIssuesList();
    }

    getIssuesList(){

        let url = "/issues/?assigned_to=" + this.state.user_id;

        axios({
            url: url,
            method: "get",
            withCredentials: true
        }).then(
            (response) => {
                this.setState({
                    issues: response.data,
                });
            }
        );
    }


    render() {

        if(this.state.issues === null){
            return(<div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>);
        }

        if(this.state.issues.length === 0){
            //SHOW NO ISSUES YET
            return (<div><div style={{marginTop:"30px", width:"80%"}} className="ui big header">My Reports: No reports yet...</div></div>);
        }

        return (
                <div id="issues-reported-by-me" style={{marginTop:"30px", width:"60%"}}>
                    <Card.Group>
                        { this.state.issues.map( (issue, index) => {
                            return (
                                <Card
                                    href={"http://localhost:3000/projects/" + issue["project"]["slug"]}
                                    key={index}
                                    style={{
                                        borderLeftWidth: "3px",
                                        borderLeftStyle: "solid",
                                        borderLeftColor: this.state.priority_colors[issue["priority"]],
                                    }}

                                    fluid
                                >
                                    {issue["resolved"] && <Label corner={"right"} color={"green"} icon={"check"} size={"mini"}/> }

                                  <Card.Content>
                                      <Card.Header>
                                          {issue["subject"]}
                                      </Card.Header>
                                      <Card.Meta>{issue["project"]["title"]}</Card.Meta>
                                      <Card.Description>
                                        {"<<TAGS GO HERE>>"}
                                      </Card.Description>
                                  </Card.Content>
                                </Card>
                            );
                        })}
                    </Card.Group>

                </div>

                       );
    }
}

export default MyAssignments;