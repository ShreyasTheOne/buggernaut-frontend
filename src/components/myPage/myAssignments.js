import React, { Component } from 'react';
import axios from 'axios';
import {Card, Loader, Label} from "semantic-ui-react";
import {urlApiIssuesAssignedToUser, urlAppProjectDetail} from "../../urls";


class MyAssignments extends Component {

    constructor(props) {
        super(props);
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
        let url = urlApiIssuesAssignedToUser(this.state.user_id);
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
        ).catch( (e) => {
            alert(e);
        });
    }


    render() {

        if(this.state.issues === null){
            return(<div className="my-loader-div"><Loader active/></div>); // {/* index.css */}
        }

        if(this.state.issues.length === 0){
            //SHOW NO ISSUES YET
            return (
                    <div className="ui big header none-available">No assignments yet...</div> // {/* index.css */}
            );
        }

        return (
                <div id="issues-assigned-to-me" className="my-page-cards-list"> {/* index.css */}
                    <Card.Group>
                        { this.state.issues.map( (issue, index) => {
                            return (
                                <Card
                                    href={urlAppProjectDetail(issue["project"]["slug"])}
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
                                        {issue["tags"].map((tag, index) => {
                                               return(
                                                   <Label key={index} className="tag-label">{tag["name"]}</Label> // {/* index.css */}
                                               );
                                            } )}
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