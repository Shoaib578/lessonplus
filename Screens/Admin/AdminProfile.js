import React from 'react'
import {View,Text,TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,TextInput } from 'react-native'
import storage from '@react-native-firebase/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import styles from './styles'

export default class AdminProfile extends React.Component {
    state = {
       email:'',
       password:'',
       isLoading:false,
       whole_loading:true
    }

    getUserInfo = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)

        firestore().collection("users").doc(parse.id).get()
        .then(res=>{
            
            this.setState({ email:res._data.email,password:res._data.password,whole_loading:false })
        })
    }

    logout = ()=>{
        AsyncStorage.removeItem("user")
        this.props.navigation.reset({
            index: 0,
            routes:[{name:'Signin'}],
        });
    }

    update_admin = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        firestore().collection("users").doc(parse.id).update({
            email:this.state.email,
            password:this.state.password
        })
        .then(res=>{
            this.getUserInfo()
            this.setState({isLoading:false})

            Alert.alert("User Updated")
        })
        .catch(err=>{
            this.setState({isLoading:false})

            Alert.alert("Something Went Wrong")
        })
    }
    
    
    componentDidMount(){
        this.getUserInfo()
        
    }
   
    render(){
        if(this.state.whole_loading == false){

        return (
            <ScrollView style={{padding:'5%',flex:1}}>
                <View style={{alignItems: 'center'}}>
                

               
                <TextInput style={[styles.EmailInput,{borderColor:'blue',borderWidth:1}]} value={this.state.email} onChangeText={(val)=>this.setState({email:val})} placeholderTextColor="#929292" placeholder="Email"/>
               
                <TextInput style={[styles.EmailInput,{borderColor:'blue',borderWidth:1,marginTop:20}]} value={this.state.password} onChangeText={(val)=>this.setState({password:val})} placeholderTextColor="#929292" placeholder="Email"/>

            {this.state.isLoading?<ActivityIndicator size="large" color="black"/>:null}
            <TouchableOpacity onPress={this.update_admin} style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,justifyContent:'center',alignItems: 'center',marginTop:20,marginBottom:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Update</Text>
                 
                </TouchableOpacity>



                <TouchableOpacity onPress={this.logout} style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,justifyContent:'center',alignItems: 'center',marginTop:20,marginBottom:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Logout</Text>
                 
                </TouchableOpacity>



                </View>

            </ScrollView>
        )
    }else{
        return <ActivityIndicator size="large" color="black" style={{alignSelf:'center',marginTop:50}}/>
    }

    }
}