import { Avatar, Typography } from '@mui/material'
import React from 'react'
import './style.css';
import { connect } from "react-redux"

function Menu(props) {

    const stringAvatar=(name)=>{
        return {
          children: `${name&&name.split(' ')[0][0]}`,
        };
    }

    return (
        <div className="menu--icon container__row">
            <Avatar sx={{ bgcolor: "#900C3F" }} {...stringAvatar(props.user.name)} />
            <Typography sx={{color:'#fff', padding:"7px"}} className="mobile--view__false">
                {props.user.email}
            </Typography>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Menu);
