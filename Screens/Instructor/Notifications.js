import React from 'react' 
import {View,Text,ScrollView, ActivityIndicator, TouchableOpacity, Alert} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default class Notifications extends React.Component {
    state  = {
        isLoading:true,
        data:[],

    }
    get_all_notifications = async ()=>{
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        firestore().collection("notifications").where("notification_for","==",parse.id).get()
        .then(res=>{
            this.setState({data:res._docs,isLoading:false})
        })

    }

    delete_notification = (id)=>{
        firestore().collection("notifications").doc(id).delete()
        .then(res=>{
            this.get_all_notifications()
        })
        .catch(err=>{
            Alert.alert("Something Went Wrong")
        })

    }
    componentDidMount(){
        this.get_all_notifications()
    }
    render(){
        if(this.state.isLoading == false){

        return (
            <ScrollView>
                {this.state.data.map((not,index)=>{
                    return (
                        <View key={index} style={{backgroundColor:'skyblue',borderColor:'skyblue',borderWidth:1,borderRadius:5,flexDirection:'row',padding:10,alignSelf:'center',marginTop:20,width:'95%',justifyContent:'space-between'}}>
                           <View style={{flexDirection:'row'}}>
                               <Text style={{color:'black',fontWeight:'bold'}}>{not._data.learner_name}</Text>
                               <Text style={{color:'black',marginLeft:5}}>{not._data.text}</Text>

                            </View> 

                            <TouchableOpacity onPress={()=>this.delete_notification(not.id)}>
                                <FontAwesome name="close" color="red" size={20}/>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }else{
        return <ActivityIndicator size="large" color="black" style={{ alignSelf: "center",marginTop:50 }}/>
    }

    }
}