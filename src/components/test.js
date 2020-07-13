import React, { Component } from 'react';
import {Placeholder, Header, Icon, Button} from "semantic-ui-react";
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.xsrfCookieName = 'buggernaut_csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

class test extends Component {

    state = { file: null,
        project_wiki: null,
        editor_images: null,
        editorID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

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

    }

    componentDidMount() {

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
                                style={{marginTop:"30px"}}> SEND IMAGES TO BACKEND </Button>
                        <div id="xyz" style={{border:"2px #000000 solid", borderRadius:"10px", height:"500px", width:"1000px", marginTop:"30px"}} >
                           <Editor
                               apiKey="0blvqqisiocr0gaootpb271thzo2qqtydxzdyba6ya9nihwr"
                              initialValue="EDITOR"
                              init={{
                                plugins:
                                  ' lists link table image codesample emoticons code charmap ' +
                                  ' fullscreen ' +
                                  ' wordcount',
                                contextmenu:
                                  'bold italic underline strikethrough | ' +
                                  'superscript subscript | ' +
                                  'link',
                                toolbar1:
                                  'formatselect | ' +
                                  'bold italic underline strikethrough blockquote removeformat | ' +
                                  'alignleft aligncenter alignright alignjustify',
                                toolbar2:
                                  'undo redo | ' +
                                  'bullist numlist outdent indent | ' +
                                  'link unlink | ' +
                                  'table image codesample charmap | ' +
                                  'fullscreen',
                                toolbar3:
                                  'fontselect fontsizeselect | emoticons',
                                relative_urls : false,
                                menubar: true,
                                height: '100%',
                                  width: '100%',
                                codesample_languages: [
                                  {text: 'HTML/XML', value: 'markup'},
                                  {text: 'JavaScript', value: 'javascript'},
                                  {text: 'CSS', value: 'css'},
                                  {text: 'PHP', value: 'php'},
                                  {text: 'Ruby', value: 'ruby'},
                                  {text: 'Python', value: 'python'},
                                  {text: 'Java', value: 'java'},
                                  {text: 'C', value: 'c'},
                                  {text: 'C#', value: 'csharp'},
                                  {text: 'C++', value: 'cpp'},
                                  {text: 'Dart', value: 'dart'},
                                  {text: 'Go', value: 'go'},
                              ],
                                  images_upload_handler: (blobInfo, success, failure, progress) => {
                                     const data = new FormData()
                                        data.append('editorID', this.editorID)
                                        data.append('url', blobInfo.blob())
                                        axios({
                                            url:"/images/",
                                            method:"post",
                                            data: data,
                                            withCredentials: true,
                                        }).then((response) =>{
                                            console.log(response);

                                            if (response.status < 200 || response.status >= 300) {
                                                failure('HTTP Error: ' + response.status);
                                            } else {
                                                success(response.data["url"])
                                            }
                                        }).catch((e) => {
                                            failure(e);
                                        });
                                    }
                              }}
                              disabled={false}
                              inline={true}
                              onEditorChange={(content) => {
                                  console.log(content)
                              }}

                            />

                        </div>

                </div>
            </div>


                       );
    }
}

export default test;