import React from 'react'
import {View,Text,TouchableOpacity, ActivityIndicator,TextInput, Alert,Image} from 'react-native'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import * as ImagePicker from "react-native-image-picker"
import SelectDropdown from 'react-native-select-dropdown'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import validator from 'validator'
import styles from './styles'
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler'

var sec = new Date().getSeconds();
var date = new Date().getDate()
class EditInstructor extends React.Component {
 gender = ["Once", "Monthly"]

    state = {
        showPass:true,
        email:this.props.route.params.data._data.email,
        
        name:this.props.route.params.data._data.name,
        adi:this.props.route.params.data._data.adi,
       
        phone_no:this.props.route.params.data._data.phone_no,
        password:this.props.route.params.data._data.password,
        profile_pic:'',
        paymentscheme:this.props.route.params.data._data.payment_scheme,
        isLoading:false,
        uri:'',
        imageName:'',

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
   
            this.setState({profile_pic:data,uri: data.uri,imageName:data.fileName+sec+'asd'+2332+'date'+date});
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



    update_instructor = ()=>{
        console.log("Update Instructor")
        if(validator.isEmail(this.state.email) == false){
            Alert.alert("Invalid Email")
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



        if(this.state.profile_pic.uri){
        console.log("This is the previous uri "+this.props.route.params.prev_uri)

            this.setState({isLoading:true})
            storage().refFromURL(this.props.route.params.prev_uri).delete()
            .then(res=>{
                this.upload_image()

                firestore().collection("users").doc(this.props.route.params.data.id).update({
                    name:this.state.name,
                    email:this.state.email,
                    phone_no:this.state.phone_no,
                    adi:this.state.adi,
                    payment_scheme:this.state.paymentscheme,
                    profile_pic:this.state.imageName,
                    password:this.state.password
                })
                .then(res=>{
                this.setState({isLoading:false})
        
                    Alert.alert("Updated Successfully")
                })
                .catch(err=>{
                this.setState({isLoading:false})
        
                    Alert.alert("Something Went Wrong")
                })



            })
            .catch(err=>{
                Alert.alert("Something Went Wrong")
                return false
            })
        }else{
            this.setState({isLoading:true})
            firestore().collection("users").doc(this.props.route.params.data.id).update({
                name:this.state.name,
                email:this.state.email,
                phone_no:this.state.phone_no,
                adi:this.state.adi,
                password:this.state.password,
                payment_scheme:this.state.paymentscheme,
               
            })
            .then(res=>{
            this.setState({isLoading:false})
    
                Alert.alert("Updated Successfully")
            })
            .catch(err=>{
            this.setState({isLoading:false})
    
                Alert.alert("Something Went Wrong")
            })
        }

       
       
    }
    
    
  

    render(){
        
    
        return (
            <ScrollView style={{ width: '100%',padding:20,backgroundColor:'white',borderRadius:10}}>
            <Text style={{color:'black',textAlign:'center',fontSize:20,fontWeight:'bold',marginTop:10}}>Edit Learner</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
            <TouchableOpacity onPress={() => this.choosePhoto()} >

            {this.state.profile_pic.uri?<Image style={{borderRadius:60,width:60,height:60,alignSelf:'center'}} source={{uri: this.state.profile_pic.uri}}/>:<Image  style={{borderRadius:60,height:60,width:60,alignSelf:'center'}} source={{uri:this.props.route.params.prev_uri}}/>}

            </TouchableOpacity>

            <View style={styles.EnteringData}>
                     <Text>Email</Text>
                    <TextInput style={styles.EmailInput} value={this.state.email} onChangeText={(val)=>this.setState({email:val})} placeholderTextColor="#929292" placeholder="Email"/>
                    <Text>Name:</Text>

                    <TextInput onChangeText={(val)=>this.setState({name:val})} value={this.state.name} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Name"/>
                    <Text>ADI:</Text>
                    
                    <TextInput style={styles.NameInput} onChangeText={(val)=>this.setState({adi:val})} value={this.state.adi} placeholderTextColor="#929292" placeholder="ADI/PDI"/>
                    <Text>Mobile Number:</Text>
                    
                    <TextInput onChangeText={(val)=>this.setState({phone_no:val})} value={this.state.phone_no} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Phone Number"  keyboardType="numeric"/>
                    <Text>Password:</Text>

                    <TextInput onChangeText={(val)=>this.setState({password:val})} value={this.state.password} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Password"  />
                    
               
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





                </View>

                {this.state.isLoading?<ActivityIndicator size="large" color="black" style={{alignSelf: "center"}}/>:null}
          


                <TouchableOpacity onPress={this.update_instructor} style={{backgroundColor:'skyblue',justifyContent:'center',alignSelf:'center',alignItems: 'center',borderColor:'skyblue',borderWidth:1,borderRadius:10,width:'42%',padding:5,marginTop:40,marginBottom:40}}>
                <Text style={{color:'white'}}>Update</Text>
                    
                </TouchableOpacity>


           

            </ScrollView>
        )
    }

    
}

export default EditInstructor