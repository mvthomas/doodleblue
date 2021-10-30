import { Button, OutlinedInput, TextField } from '@mui/material';
import React, { Component, useState, useEffect, useRef } from 'react'
import './styles.css';
import { createStyles, withStyles } from '@mui/styles'
import { connect } from "react-redux"
import { getChat, updateChat } from '../network';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux'

const styles = theme => createStyles({
    root: {
      "& .MuiFormLabel-root": {
        color: "#999999"
      },
      "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
        "border": "1px solid #999999"
      },
      "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline:hover": {
        "border": "1px solid #fff"
      },
      "& .css-1p823my-MuiListItem-root": {
          "padding-left": "10px",
          "padding-right": "10px"
      },
      "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root":{
          color:'#fff'
      }
    }
});


function Messages(props) {

    const [input, setInput] = useState("")
    const [name, setName] = useState("Choose a contact to chat")
    const { classes} = props;
    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user)
    const messages = useSelector((state) => state.messages)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const renderMessages=()=>{
        return messages?messages.texts?messages.texts.length>0?messages.texts.map((item, index)=>{
            return <div className="message--box" ref={messagesEndRef}>
                    {
                        item.id==user.id&&
                            <div className="message--item--sent">
                                <p className="text__white message--text message--sent">{item.text}</p>
                            </div>
                    }
                    {
                        item.id==chat.id&&
                            <div className="message--item--received">
                                <p className="text__white message--text message--received">{item.text}</p>
                            </div>
                    }
            </div>
        }):<div className="message--box message--intro">Ready to start a conversation</div>:<div className="message--box">Ready to start a conversation</div>:<div className="message--box">Ready to start a conversation</div>
    }

    const onMessage=async()=>{
        let id = Number(user.id)+Number(chat.id)
        let data=messages
        data.texts.push({id:user.id, text:input})
        console.log(data)
        let resp = await updateChat(String(id), data)
        setInput("")
    }

    const onInput=async(value)=>{
        setInput(value)
    }

    return (
        <div className="message--container">
        <h2 className="text__white message--title">{chat.name?chat.name:name}</h2>
        <div className="message--view">
            {
                renderMessages(messages)
            }
        </div>
        <div className="enter--message">
            <TextField sx={{width:"70%"}} onChange={(e)=>onInput(e.target.value)} value={input} className={classes.root} />
            <Button onClick={()=>onMessage()} sx={{margin:"7px"}} variant="contained" color="success" size="large">{"Send"}</Button>
        </div>
    </div>
    )
}

export default withStyles(styles)(Messages);
