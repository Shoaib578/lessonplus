
import React from "react";
import {Text, Image,  SafeAreaView, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native'

import styles from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
class Signin extends React.Component{
    state = {
        showPass:true,
        email:"",
        password:'',
        isLoading:false,
        user:[]
    }
   
//    getAllUsers = ()=>{
//     firestore()
//     .collection('users')
//     .where('email', '==', this.state.email).get()
//     .then(res=>{
//         console.log(res)
//     })
//    }

   componentDidMount(){
       
   }


Login = ()=>{
    this.setState({isLoading:true})
    firestore()
    .collection('users')
    .where('email', '==', this.state.email).get()
    .then(res=>{
        if(res.size>0){

        res._docs.map(async(data)=>{
           
            if(data._data.password == this.state.password){
                console.log(data.id)
                this.setState({isLoading:false,email:'',password:''})
                const user = {
                    "name":data._data.name,
                    "profile_pic":data._data.profile_pic,
                    "email":data._data.email,
                    "phone_no":data._data.phone_no,
                    "adi":data._data.adi,
                    "payment_scheme":data._data.payment_scheme,
                    "id":data.id,
                    "is_admin":data._data.is_admin



                }
                
                await AsyncStorage.setItem('user',JSON.stringify(user))
                if(data._data.is_admin == 0){
                    this.props.navigation.reset({
                        index: 0,
                        routes:[{name:'Instructor'}],
                    });
                }else{
                    this.props.navigation.reset({
                        index: 0,
                        routes:[{name:'Admin'}],
                    });
                }
                
            }else{
            this.setState({isLoading:false,})

                Alert.alert("Invalid Email or Password")
                return false
            }
        })
    }else{
        this.setState({isLoading:false})

        Alert.alert("Invalid Email or Password")
        return false
    }

    })
    .catch(err=>{
        Alert.alert("Something Went Wrong")
        return false
    })
}
 
    render(){
        return(
            <ScrollView style={styles.container}>
          
            <SafeAreaView style={{flex:1,}}>
                <View style={styles.LogoBox}>
                    <Image style={styles.Logo} source={require('../../../assets/Logo.png')}/>
                </View>
                <View style={styles.EnteringData}>
                    <TextInput style={styles.EmailInput} value={this.state.email} placeholderTextColor="#929292" onChangeText={(val)=>this.setState({email:val})} placeholder="Email"/>
                    
                <View style={styles.PasswordInput}>
                {this.state.showPass == true ? 
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../../assets/eye.png')} style={styles.imageStyle}/>
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../../assets/crosseye.png')} style={styles.CrossEyeIconStyle}/>
                </TouchableOpacity>
                }
                

                <TextInput  value={this.state.password} placeholderTextColor="#929292" secureTextEntry={this.state.showPass} onChangeText={(val)=>this.setState({password:val})} placeholder="Password" style={styles.InputField}/>

            </View>
            {this.state.isLoading?<ActivityIndicator size="large" color="black"/>:null}
            <TouchableOpacity onPress={this.Login} style={styles.LoginButton}>
                    <Text style={styles.LoginButtonText}>Login</Text>
            </TouchableOpacity>
          
                </View>


               
            </SafeAreaView>

           
            <View style={styles.DontHaveAccount}>
                <Text style={styles.DontHaveAccountText}>Don't have an account?</Text>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup')}  style={styles.SignUpLink}>
                    <Text style={styles.DontHaveAccountSignUpLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        )
    }
}

export default Signin;