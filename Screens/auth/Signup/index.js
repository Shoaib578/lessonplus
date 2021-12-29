import React from "react";
import {Text, Image,  SafeAreaView, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native'
import styles from './styles'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import * as ImagePicker from "react-native-image-picker"
import SelectDropdown from 'react-native-select-dropdown'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import validator from "validator";




class SignUp extends React.Component{

    gender = ["Once", "Monthly","Weekly"]

    
    state = {
        showPass:true,
        email:'',
        password:'',
        name:'',
        adi:'',
        uri:'',
        phone_no:'',
        imageName:'',
        profile_pic:'',
        paymentscheme:'',
        isLoading:false
    }

    choosePhoto(){
        const options = {
          noData:true
        };
        ImagePicker.launchImageLibrary(options, response => {
          console.log("response", response);
          if(response.assets){
            
            response.assets.map(data=>{
           console.log(data);
   
            this.setState({profile_pic:data,uri: data.uri,imageName:data.fileName});
           })
           
         }
        });
      }

    upload_image = async()=>{
       try{
        await storage().ref('profile_pics/'+this.state.imageName).putFile(this.state.uri)
        .then(res=>{
            console.log("Image has been Uploads")
        })

       }catch(e){
        Alert.alert("Something Went Wrong")
        return false
       }
       
    }  


    SignUp = ()=> {
        if(this.state.profile_pic.length<1){
            Alert.alert("Please Select Profile Picture")
            return false

        }


        if(validator.isEmail(this.state.email) == false){
            Alert.alert("Invalid Email")
            return false
        }

        if(this.state.password.length<5){
            Alert.alert("Password Must Be at least 5 characters")
            return false
        }

        if(this.state.name.length<1){
            Alert.alert("Please Enter Your Name")
            return false
        }

        if(this.state.adi.length < 1){
            Alert.alert("Please Enter Adi")
            return false
        }

        if(this.state.paymentscheme.length<1){
            Alert.alert("Please Select Payment Scheme")
            return false
        }

        if(validator.isMobilePhone(this.state.phone_no) == false){
            Alert.alert("Invalid Phone Number")
            return false
        }




        
        this.setState({isLoading:true})
        firestore().collection('users').where("email",'==',this.state.email).get()
        .then(res=>{
            if(res.size <1){
                this.upload_image()
                .then(i=>{
                    firestore().collection('users')
                    .add({
                      
                        name:this.state.name,
                        profile_pic:this.state.imageName,
                        email:this.state.email,
                        password:this.state.password,
                        adi:this.state.adi,
                        payment_scheme:this.state.paymentscheme,
                        phone_no:this.state.phone_no,
                        is_admin:0
     
                    })
                    .then(res=>{
                        this.setState({isLoading:false,
                            email:'',
                            password:'',
                            name:'',
                            adi:'',
                            uri:'',
                            imageName:'',
                            profile_pic:'',
                            paymentscheme:'',
                            phone_no:''
                        })
                        
                        Alert.alert("Registered Successfully")
                    })
                    .catch(err=>{
                        this.setState({isLoading:false})
                        Alert.alert("Something Went Wrong")
                    })
                })
              
            }else{
                this.setState({isLoading:false})

                Alert.alert("Email Already Exist Please Try Another One")
                return false
            }
        })
        .catch(err=>{
            Alert.alert("Something Went Wrong")
        })
    }

    render(){
        return(
            
                <ScrollView  style={styles.container}>
           
            
               
                <TouchableOpacity onPress={() => this.choosePhoto()} style={styles.ProfileImage}>
                {this.state.profile_pic.uri?<Image style={[styles.ProfileImageIcon,{borderRadius:80}]} source={{uri: this.state.profile_pic.uri}}/>:<Image  style={styles.ProfileImageIcon} source={require('../../../assets/ProfileImage.png')}/>}

                
                </TouchableOpacity>
                <View style={styles.EnteringData}>
                    <TextInput style={styles.EmailInput} value={this.state.email} onChangeText={(val)=>this.setState({email:val})} placeholderTextColor="#929292" placeholder="Email"/>

                    <TextInput onChangeText={(val)=>this.setState({name:val})} value={this.state.name} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Name"/>
                    <TextInput style={styles.NameInput} onChangeText={(val)=>this.setState({adi:val})} value={this.state.adi} placeholderTextColor="#929292" placeholder="ADI/PDI"/>
                    <TextInput onChangeText={(val)=>this.setState({phone_no:val})} value={this.state.phone_no} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Mobile Number"  keyboardType="numeric"/>

                    
                <View style={styles.PasswordInput}>
                {this.state.showPass == true ? 
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../../assets/eye.png')} style={styles.imageStyle}/>
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../../assets/crosseye.png')} style={styles.CrossEyeIconStyle}/>
                </TouchableOpacity>
                }
                
                <TextInput placeholderTextColor="#929292" value={this.state.password} onChangeText={(val)=>this.setState({password:val})} secureTextEntry={this.state.showPass} placeholder="Password" style={styles.InputField}/>

            </View>
            <SelectDropdown
                renderDropdownIcon={() => (
                    <MIcon name="keyboard-arrow-down" color="#7C7C7C" size={23} />
                )}
                 defaultButtonText="Payment"
                 buttonStyle={styles.dropDown}
	             data={this.gender}
	             onSelect={(selectedItem, index) => {
		         this.setState({paymentscheme:selectedItem})
	             }}
	            buttonTextAfterSelection={(selectedItem, index) => {
		        
		        return selectedItem
	            }}
	            rowTextForSelection={(item, index) => {
		        // text represented for each item in dropdown
		        // if data array is an array of objects then return item.property to represent item in dropdown
		        return item
	            }}
                />
                {this.state.isLoading?<ActivityIndicator size="large" color="black" style={{ alignSelf: "center" }}/>:null}
                <TouchableOpacity onPress={this.SignUp}  style={styles.LoginButton}>
                        <Text style={styles.LoginButtonText}>Sign Up</Text>
                </TouchableOpacity>
          
                </View>
                
             

                    <View style={styles.AlreadyHaveAccount}>
                    <Text style={styles.DontHaveAccountText}>Already have an account?</Text>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("Signin")} style={styles.SignInLink}>
                        <Text style={styles.AlreadyHaveAccountSignInLink}>Login</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                
              

            
            
            
        )
    }
}

export default SignUp;