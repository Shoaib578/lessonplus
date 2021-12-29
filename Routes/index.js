import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import {View,Text,TouchableOpacity, Image} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import Signin from '../Screens/auth/Signin';
import SignUp from '../Screens/auth/Signup';
import Splash from '../Screens/Splash';
import AdminHome from '../Screens/Admin';
import AdminInstructor from '../Screens/Admin/AdminInstructor'
import InstructorHome from '../Screens/Instructor';
import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Profile from '../Screens/Profile';
import Notifications from '../Screens/Instructor/Notifications';
import EditLearner from '../Screens/Admin/edit_learner';
import EditInstructor from '../Screens/Admin/edit_instructor';
import AdminProfile from '../Screens/Admin/AdminProfile';
import OneInstructorLearners from '../Screens/Admin/OneInstructorLearners';
import BackgroundService from 'react-native-background-actions';
import PushNotification from "react-native-push-notification";



const Stack = createStackNavigator()


export default class Routes extends React.Component {
    state = {
        profile_pic:''
    }

   
    background = async () => {
        let shouldContinue = true;

        const veryIntensiveTask = async (taskDataArguments) => {
            // Example of an infinite loop task
            const { delay } = taskDataArguments;
            await new Promise(async (resolve) => {

                // for (let i = 0; BackgroundService.isRunning(); i++) {
                //     console.log(i);
                setTimeout(() => this.get_notifications_request(), 10000);
                // }
            });
        };

        const options = {
            taskName: 'Lesson Plus',
            taskTitle: 'Lesson Plus',
            taskDesc: '',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
            parameters: {
                delay: 1000,
            },
        };


        await BackgroundService.start(veryIntensiveTask, options);
    }

    get_notifications_request = async () => {
        const user = await AsyncStorage.getItem("user")
        const parse = JSON.parse(user)
        if(parse != null){
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
    



    getUserProfilePic = async()=>{
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
    
    header_right = (navigation)=>{
       
        
        return(
            <View style={{flexDirection:'row',marginRight:20}}>
        <TouchableOpacity  style={{right:20,top:10}} onPress={()=>navigation.navigate('Notifications')}>
            <FontAwesome name="bell" color="#242d6f" size={25}/>
        </TouchableOpacity>


        <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
            <Image source={this.state.profile_pic?{uri:this.state.profile_pic}:require('../assets/ProfileImage.png')} style={{ width:40,height:40,borderRadius:40 }}/>
        </TouchableOpacity>

        </View>
        )
    }


    admin_header_right = (navigation)=>{
        return(
            <TouchableOpacity onPress={()=>navigation.navigate('AdminProfile')} style={{marginRight:20}}>
            <Image source={require('../assets/ProfileImage.png')} style={{ width:40,height:40,borderRadius:40 }}/>
        </TouchableOpacity>
        )
    }

    
        
   InstructorStack = ({navigation})=>{
       return(
           <Stack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
            <Stack.Screen name="InstructorHome" component={InstructorHome} options={{headerRight:()=>this.header_right(navigation),headerTitle:'Instructor'}}/>
            <Stack.Screen name="Notifications" component={Notifications} />

             <Stack.Screen name="Profile" component={Profile} />
           </Stack.Navigator>
       )
   }

   AdminStack = ({navigation})=>{
       return(
           <Stack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
        <Stack.Screen name="AdminHome" component={AdminHome} options={{headerTitle:'Admin',headerRight:()=>this.admin_header_right(navigation)}}/>
        <Stack.Screen name="EditLearner" component={EditLearner} options={{headerTitle:'Edit Learner',headerRight:()=>this.admin_header_right(navigation)}}/>
        <Stack.Screen name="AdminProfile" component={AdminProfile} options={{headerTitle:'Admin Profile'}}/>
        <Stack.Screen name="OneInstructorLearners" component={OneInstructorLearners} options={{headerTitle:'Instructor Learners'}}/>

        <Stack.Screen name="AdminInstructor" component={AdminInstructor} options={{headerTitle:'Admin Instructors',headerRight:()=>this.admin_header_right(navigation)}}/>
        <Stack.Screen name="EdiInstructor" component={EditInstructor} options={{headerTitle:'Edit Instructor',headerRight:()=>this.admin_header_right(navigation)}}/>
        </Stack.Navigator>
       )
   }
        
 componentDidMount(){

     this.getUserProfilePic()
     this.background()
   
 }
       
    



    render(){
        return(
            <NavigationContainer>
            <Stack.Navigator initialRouteName='Splash' screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
             
            
            <Stack.Screen name="Admin" component={this.AdminStack} options={{headerShown:false}}/>


             <Stack.Screen name="Instructor" component={this.InstructorStack} options={{headerShown:false}}/>
            
             <Stack.Screen name="Signin" component={Signin} options={{headerShown:false}}/>
             <Stack.Screen name="Signup" component={SignUp}/>

            </Stack.Navigator>
            </NavigationContainer>
           
        )
    }
}
