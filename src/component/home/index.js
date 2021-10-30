import React, { Component } from 'react';
import { Avatar, Container, Grid } from '@mui/material'
import Menu from '../services/menu';
import ContactList from '../services/contacts';
import Messages from '../services/message';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default class Home extends Component {

    state={
        open:false
    }

    toggleMenu=(status)=>{
        this.setState({open:status})
    }

    render() {
        const {open} = this.state
        return (
            <Container className="display__fluid container__row">
                <div className="menu--button">
                    <Avatar sx={{ bgcolor: "#2DA500" }} onClick={()=>this.toggleMenu(!open)}>
                        {open?<NavigateBeforeIcon /> :<NavigateNextIcon/>}
                    </Avatar>
                </div>
                <Grid xs={12} lg={3} xl={3} md={3} className={"color__black "+(open?"contact--list__close":"contact--list__slider")}>
                    <ContactList onClickChat={()=>this.toggleMenu(false)}/>
                </Grid>
                <Grid xs={12} lg={9} xl={9} md={9} className="color__greyer">
                    <Messages/>
                </Grid>
            </Container>
        )
    }
}
