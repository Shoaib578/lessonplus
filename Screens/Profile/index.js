import React from 'react'
import {View,Text,TouchableOpacity, ScrollView, Image } from 'react-native'
import storage from '@react-native-firebase/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
export default class Profile extends React.Component {
    state = {
        profile_pic:'',
        data:'',
        how_many_learners:0
    }

    getUserInfo = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        this.setState({data:parse})
        storage()
        .ref('profile_pics/' + parse.profile_pic) //name in storage in firebase console
        .getDownloadURL()
        .then((url) => {
            console.log(url)
         this.setState({profile_pic:url})
        })
        .catch((e) => console.log('Errors while downloading => ', e));
    }

    logout = ()=>{
        AsyncStorage.removeItem("user")
        this.props.navigation.reset({
            index: 0,
            routes:[{name:'Signin'}],
        });
    }
    
    get_learners_count = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        console.log("This is my id"+parse.id)
        firestore().collection("learner").where("allocated_to","==",parse.id).get()
        .then(res=>{
            this.setState({how_many_learners:res.size})
        })


    }
    componentDidMount(){
        this.getUserInfo()
        this.get_learners_count()
        
    }
   
    render(){
        return (
            <ScrollView style={{padding:'5%',flex:1}}>
                <View style={{alignItems: 'center'}}>
                <Image source={this.state.profile_pic?{uri:this.state.profile_pic}:require('../../assets/ProfileImage.png')} style={{width:100,height:100,borderRadius:100}} />

                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Name : </Text>
                    <Text style={{color:'white',}}>{this.state.data.name}</Text>
                </View>

                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Role : </Text>
                    <Text style={{color:'white',}}>{this.state.data.is_admin == 1 ?'Admin':'Instructor'}</Text>
                </View>


                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Email : </Text>
                    <Text style={{color:'white',}}>{this.state.data.email}</Text>
                </View>

                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>ADI : </Text>
                    <Text style={{color:'white',}}>{this.state.data.adi}</Text>
                </View>


                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Payment Scheme : </Text>
                    <Text style={{color:'white',}}>{this.state.data.payment_scheme}</Text>
                </View>

                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Mobile Number : </Text>
                    <Text style={{color:'white',}}>{this.state.data.phone_no}</Text>
                </View>


                <View style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,flexDirection:'row',marginTop:20}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Learners : </Text>
                    <Text style={{color:'white',}}>{this.state.how_many_learners}</Text>
                </View>

            
                <TouchableOpacity onPress={this.logout} style={{width:'95%',borderRadius:10,borderColor:'#242d6f',backgroundColor:'#242d6f',padding:10,justifyContent:'center',alignItems: 'center',marginTop:20,marginBottom:60}}>
                    <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Logout</Text>
                 
                </TouchableOpacity>



                </View>

            </ScrollView>
        )
    }
}