import React, { Component } from 'react';
import {Placeholder, Header, Icon, Button} from "semantic-ui-react";


class test extends Component {

    state = { file: null }

    testSocket = new WebSocket("ws://127.0.0.1:8000/ws/issue/1/");

    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    testMessage() {
        this.testSocket.send(JSON.stringify({
           'comment_id': 1,
        }));
    }

    componentDidMount() {

        this.testSocket.addEventListener("open", () => {
            console.log("Connection established!");
        });

        this.testSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
        };

    }


    render() {
        return (
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",  margin:"50px"}}>
                          <Header as='h2'>
                            <Icon name='settings' />
                            <Header.Content>TEST PAGE</Header.Content>
                          </Header>

                          <div style={{width:"500px", marginTop:"50px"}}>
                              <Placeholder fluid>
                                <Placeholder.Header image>
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                </Placeholder.Paragraph>
                              </Placeholder>
                          </div>

                        <Button size="large"
                                onClick={this.testMessage.bind(this)}
                                style={{marginTop:"30px"}}> CLICK ON ME TO GET MESSAGE</Button>
                        <div id="xyz" style={{border:"2px #000000 solid", borderRadius:"10px", height:"500px", width:"1000px", marginTop:"30px"}} >

                        </div>

                </div>
            </div>


                       );
    }
}

export default test;