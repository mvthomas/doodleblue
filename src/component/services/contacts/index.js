import { AppBar, Avatar, Box, Button, Container, Dialog,Snackbar, ListItemButton, Modal, ListItemIcon, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Slide, TextField, Toolbar, Typography, Input, LinearProgress, Alert, AlertTitle } from '@mui/material'
import { createStyles, withStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import React, { Component } from 'react'
import './styles.css';
import Menu from '../menu';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { addUser, deleteUser, getDB } from '../network';
import { validateEmail, validatePhone } from '../validation';
import InfoIcon from '@mui/icons-material/Info';     
import { connect } from "react-redux"
import { setCurrentChat, setCurrentUser, setMessage } from '../../../redux/actions';


const styles = theme => createStyles({
    root: {
      "& .MuiFormLabel-root": {
        color: "#999999"
      },
      "& .css-1480iag-MuiInputBase-root-MuiInput-root:before": {
        "border-bottom": "1px solid #999999"
      },
      "& .css-1p823my-MuiListItem-root": {
          "padding-left": "10px",
          "padding-right": "10px"
      },
      "& .css-10ghrmp-MuiPaper-root-MuiAppBar-root":{
          "background-color":"#000"
      },
      "& .css-m9glnp-MuiPaper-root-MuiDialog-paper": {
          "background-color":'#222222'
      }
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ContactList extends Component {

    state={
        contact:[],
        modal:false,
        detailsModal:{show:false},
        addUser: false,
        addUserText:'Add User',
        email:'',
        phone:'',
        name:'',
        company:'',
        emailVal:false,
        phoneVal:false,
        nameVal:false,
        companyVal:false,
        alert_:{show:false}
    }

    componentDidMount=async()=>{
        this.getUser()
    }

    getUser=async()=>{
        let contactsList = await getDB("uid")
        let email = this.props.user.email
        contactsList = contactsList.filter(check)
        function check(item) {
            return item.email != email;
        }
        this.setState({contact:contactsList})
    }

    stringAvatar(name) {
        return {
          children: `${name.split(' ')[0][0]}`,
        };
    }

    deleteUser_=async(email)=>{
        if(email!="mvthomas121@gmail.com"){
            await deleteUser(email)
            this.getUser()
            this.showAlert({show:true, title:"Deleted user!!"})
        } else {
            alert("Don't delete this user, as this is the Admin users id")
        }
        
    }

    editUser=async(item)=>{
        this.setState({
            name:item.name, 
            email:item.email, 
            phone:item.phone, 
            company:item.company,
            addUserText:"Update User",
        })
        this.handleAddUser()
    }

    renderList=(controls)=>{
        const {contact} = this.state;
        return contact.length>0?contact.map((item, index)=>{
            return <ListItem>
                <ListItemButton onClick={()=>this.onChat(item)}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#09990B" }} {...this.stringAvatar(item.name)} />
                    </ListItemAvatar>
                    <ListItemText
                        primaryTypographyProps={{style:{color:"#fff"}}}
                        secondaryTypographyProps={{style:{color:"#999999"}}}
                        primary={item.name}
                        secondary={item.email}
                    />
                </ListItemButton>
                {
                    controls&&
                    <ListItemIcon>
                        <Button variant="contained" color="success" onClick={()=>this.loginUser(item)} size="small" style={{marginRight:20}}> Login</Button>
                        <ModeEditIcon sx={{color:'#fff', marginRight:4}} onClick={()=>this.editUser(item)}/>
                        <InfoIcon sx={{color:'#fff', marginRight:4}} onClick={()=>this.handleCloseDetails(item)}/>
                        <ChatIcon sx={{color:'#DAF7A6', marginRight:4}} onClick={()=>this.onChat(item)}/>
                        <DeleteForeverIcon sx={{color:'#FF5733', marginRight:4}} onClick={()=>this.deleteUser_(item.email)}/>
                    </ListItemIcon>
                }
            </ListItem>
        }):<div style={{width:'100%', marginTop:"10%", textAlign:"center"}}>
            <LinearProgress color="success" />
            <div className="loading--intro">Loading ...</div>
        </div>
    }

    handleClose=()=>{
        const { modal } = this.state;
        this.setState({modal:!modal})
    }

    handleCloseDetails=(data)=>{
        let detailsModal = {}
        if(data.name){
            detailsModal=data
            detailsModal.show=true
        } else {
            detailsModal.show=false
        }
        this.setState({detailsModal})
    }

    showAlert=(obj)=>{
        this.setState({alert_:obj})
        this.handleClose()
    }

    handleAddUser=()=>{
        const {addUser} = this.state;
        if(addUser){
            this.setState({addUser:false, addUserText:'Add User'})
        } else {
            this.setState({addUser:true})
        }
    }

    handleInput=(type, value)=>{
        let input = value.target.value
        switch (type) {
            case "email":
                const valid = validateEmail(input)
                this.setState({emailVal:!valid, [type]:input})
                break;
            case "phone":
                const validPhone = validatePhone(input)
                if(input.length<11){
                    this.setState({phoneVal:!validPhone, [type]:input})
                }
                break;
            default:
                this.setState({[type+"Val"]:type?false:true, [type]:input})
                break;
        }
    }

    addUser=async()=>{
        const {emailVal, phoneVal, nameVal, companyVal, email, phone, name, company} = this.state
        if(!emailVal&&!phoneVal&&!nameVal&&!companyVal&&email&&phone&&name&&company){
            let id = new Date().getTime()
            let data = {name, email, phone, company, id}
            let response = await addUser(data)
            if(response.status){
                this.getUser()
                this.handleAddUser()
                this.showAlert({show:true, title:"Added user!!"})
            } else {
                this.showAlert({show:true, title:response.data})
                this.getUser()
                this.handleAddUser()
            }
        }

    }

    onChat=async(item)=>{
        this.props.setMessage({texts:[]})
        await this.props.setCurrentChat(item)
        const {user} = this.props;
        let id = Number(user.id)+Number(item.id)
        onSnapshot(doc(db, "chats", String(id)), (doc) => {
            this.props.setMessage(doc.data())
        });
        this.setState({modal:false})
        this.props.onClickChat()
    }

    loginUser=async(item)=>{
        await this.props.setCurrentUser(item)
        await localStorage.setItem("user", JSON.stringify(item))
        this.getUser()
        await this.props.setMessage({texts:[]})
        await this.props.setCurrentChat({name:false, email:false})
        this.showAlert({show:true, title:`Logged in as ${item.email}`})
    }

    render() {
        const { classes, user } = this.props;
        const { modal, detailsModal, alert_, addUserText, addUser, email, phone, name, company, emailVal, phoneVal, nameVal, companyVal } = this.state;
        return (
            <Container className="contact--container">
                {/* Alert Modal */}
                <Snackbar
                    open={alert_.show}
                    anchorOrigin={{ vertical:"top", horizontal:"center" }}
                    autoHideDuration={3000}
                    sx={{zIndex:4000}}
                >
                    <Alert onClose={()=>this.setState({alert_:{show:false}})} severity="success" sx={{ width: '100%' }}>
                        {alert_.title}
                    </Alert>
                </Snackbar>
                {/* Details Modal */}
                <Modal
                    open={detailsModal.show}
                    onClose={this.handleCloseDetails}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {detailsModal.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Email: {detailsModal.email}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Phone: {detailsModal.phone}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Company: {detailsModal.company}
                    </Typography>
                    </Box>
                </Modal>
                {/* Add user Modal */}
                <div class="add--user">
                    <Modal
                    open={addUser}
                    onClose={this.handleAddUser}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className={classes.root}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        zIndex:1301
                    }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {addUserText}
                    </Typography>
                    <div className="addUser--box">
                        <TextField label={"Name"} type="text" onChange={(e)=>this.handleInput("name",e)} error={nameVal} value={name} fullWidth margin="dense" id="fullWidth" />
                        <TextField label={"Email"} type="email" onChange={(e)=>this.handleInput("email",e)} error={emailVal} value={email} fullWidth margin="dense" id="fullWidth" />
                        <TextField label={"Phone"} type="number" onChange={(e)=>this.handleInput("phone",e)} error={phoneVal} value={phone} fullWidth margin="dense" id="fullWidth" />
                        <TextField label={"Company"} type="text" onChange={(e)=>this.handleInput("company",e)} error={companyVal} value={company} fullWidth margin="dense" id="fullWidth" />
                        <Button variant="contained" onClick={this.addUser}>{addUserText}</Button>
                    </div>
                    </Box>
                </Modal>
                </div>
                <Grid xs={12} className="container__row contact--head justify--between">
                    <h3 className="text__white inline--block contact--title">Message</h3>
                    {/* <Button variant="contained" size="small" onClick={this.handleClose}>Manage</Button> */}
                    <div onClick={this.handleClose}><Menu/></div>
                    <Dialog
                        fullScreen
                        open={modal}
                        onClose={this.handleClose}
                        TransitionComponent={Transition}
                        className={classes.root}
                        color="success"
                    >
                        <AppBar sx={{ position: 'fixed', backgroundColor:'#000' }}>
                        <Toolbar>
                            <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.handleClose}
                            aria-label="close"
                            >
                            <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Manage Contact
                            </Typography>
                            <Typography sx={{ ml: 1, color:'#999999', display:'block', marginRight:10 }} variant="p" component="div">
                                Logged in as : {user.email}
                            </Typography>
                            <Button autoFocus color="inherit" onClick={this.handleAddUser}>
                                Add Contact
                            </Button>
                        </Toolbar>
                        </AppBar>
                        <List className={classes.root} style={{margin:"10% 5%"}}>
                            {
                                this.renderList(true)
                            }
                        </List>
                    </Dialog>
                </Grid>
                <Grid className="contact--list">
                    <List dense={false} className={classes.root}>
                        {
                            this.renderList()
                        }
                    </List>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser: (payload) => dispatch(setCurrentUser(payload)),
        setCurrentChat: (payload) => dispatch(setCurrentChat(payload)),
        setMessage: (payload) => dispatch(setMessage(payload)),
    }
  }

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContactList));
