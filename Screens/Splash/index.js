import React from 'react';
import {View,Text,Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default class Splash extends React.Component {
    state = {
        isLoggedIn:false,
      
      }

    isLoggedIn = async()=>{
        const user = await AsyncStorage.getItem('user')
        const parse = JSON.parse(user)
      
        if(parse == null){
          this.setState({isLoggedIn:false})
        }else{
          this.setState({isLoggedIn:true})
        }

        if(this.state.isLoggedIn){
            if(parse.is_admin == 1){
                this.props.navigation.reset({
                    index: 0,
                    routes:[{name:'Admin'}],
                });
            }else{
                this.props.navigation.reset({
                    index: 0,
                    routes:[{name:'Instructor'}],
                });
            }
            
        }else{
            this.props.navigation.reset({
                index: 0,
                routes:[{name:'Signin'}],
            });
        }

        
        }

        componentDidMount(){
            setTimeout(()=>{
              this.isLoggedIn()
          
            },1000)
              
          }


    render(){
        return(
            <View style={{ width:'100%',
            height:'30%',
            alignItems:'center',
            justifyContent:'center',
            marginBottom:'10%',
            marginTop:'5%',flex:1}}>
                <Image source={require('../../assets/Logo.png')} style={{  width:270,
                height:140}}/>
            </View>
        )
    }
}