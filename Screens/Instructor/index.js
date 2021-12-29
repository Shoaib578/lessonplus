import React from 'react'
import {View,Text,Image, ScrollView, ActivityIndicator,TextInput} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import Learner from './Learner'
import PushNotification from "react-native-push-notification";

class InstructorHome extends React.Component {
    state = {
        profile_pic:'',
        data:[],
        searched_data:[],
        isLoading:true

    }

    getUser = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        storage()
        .ref('profile_pics/' + parse.profile_pic) //name in storage in firebase console
        .getDownloadURL()
        .then((url) => {
            console.log(url)
         this.setState({profile_pic:url})
        })
        .catch((e) => console.log('Errors while downloading => ', e));
    } 

    get_learners = async()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        console.log("This is my id"+parse.id)
        firestore().collection("learner").where("allocated_to","==",parse.id).get()
        .then(res=>{
           
            this.setState({data:res._docs})
            this.setState({searched_data:this.state.data,isLoading:false})
        })


    }


    get_all_notifications = async ()=>{
       
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        firestore().collection("notifications").where("notification_for","==",parse.id).get()
        .then(res=>{
            res._docs.forEach(i=>{
                console.log(i)
                if(i._data.is_seen == 0){
                    this.handleNotification(i._data.learner_name,i.id)
                }
            })
        })

    }



    create_channel = ()=>{
        PushNotification.createChannel({
            channelId:"first channel",
            channelName:"Shoaib First Notifications"
        })
    }

    handleNotification = (learner_name,notification_id)=>{
        firestore().collection("notifications").doc(notification_id).update({
            is_seen:1
        })
        PushNotification.localNotification({
            channelId:'asd',
            title:'Lesson Plus',
            message:learner_name+' is allocated to you',
            playSound:true,
            
           
        })
    }
    
    componentDidMount(){
        setInterval(()=>{
            this.get_all_notifications()

        },10000)
        this.create_channel()
        this.getUser()
        this.props.navigation.addListener("focus",()=>{
            this.get_learners()
        })
        this.get_learners()

      
    }
    render(){
        return(
            <ScrollView>
               <Text style={{color:'#242d6f',fontSize:20,fontWeight:'bold',marginTop:20,textAlign:'center'}}>All Learners</Text>
              
              
               <TextInput placeholder="Search Learner" style={{ backgroundColor:'#E8E8E8',
                width:'94%',
                height:48,
                marginTop:20,
                fontSize:17,
                borderRadius:6,
                color:'#929292',
                paddingLeft:10,alignSelf:'center'}} onChangeText={(value)=>{
                        if(value.length>0){
                          
                        this.setState({searched_data: this.state.data.filter(i=>i._data.name.toLowerCase().includes(value.toLowerCase())),})
                    }else{
                        this.get_learners()
                    }

                   
                }
                }/>
                {this.state.isLoading == false?this.state.searched_data.map((data,index)=>{
                    return (
                        <Learner key={index} data={data} />

                    )
                }):
                
                <ActivityIndicator size="large" color="black" style={{ alignSelf: "center",marginTop:50 }}/>
                }
                

            </ScrollView>
        )
    }
}

export default InstructorHome