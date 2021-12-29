import React from 'react'
import {View,Text, Button, TouchableOpacity,TextInput,Image, ScrollView, Alert, ActivityIndicator} from 'react-native'


import Modal from "react-native-modal";
import styles from './styles'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import * as ImagePicker from "react-native-image-picker"
import {Picker} from '@react-native-picker/picker';
import validator from 'validator'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import SelectDropdown from 'react-native-select-dropdown'
import Instructor from './Instructor'
var sec = new Date().getSeconds();
var date = new Date().getDate()

class AdminInstructor extends React.Component {
 gender = ["Once", "Monthly","Weekly"]

    state = {
        showPass:true,
        email:'',
        password:'',
        name:'',
        adi:'',
        phone_no:'',
        paymentscheme:'',
        showModal:false,
        instructors:[],
        search_instructors:[],
        profile_pic:'',
        imageName:'',
        uri:'',
        isLoading:false,
        whole_loading:true
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


      get_all_instructors = ()=>{
        
        
        firestore().collection("users").where("is_admin","==",0).get()
        .then(res=>{
          this.setState({instructors:res._docs})
          this.setState({search_instructors:this.state.instructors,whole_loading:false})
        })
      
       
      }


      add_instructor = ()=>{
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
                        
                        Alert.alert("Instructor Added Successfully")
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

     componentDidMount(){
         this.get_all_instructors()

         this.props.navigation.addListener("focus",()=>{
             this.setState({whole_loading:true})
             this.get_all_instructors()

         })
     }


    render(){
      

        return (
            <ScrollView>
                
                <TouchableOpacity onPress={()=>this.setState({showModal:true})} style={{backgroundColor:'skyblue',justifyContent:'center',alignItems: 'center',borderColor:'skyblue',borderWidth:1,borderRadius:10,width:'90%',padding:5,alignSelf: 'center',marginTop:20}}>
                <Text style={{color:'white'}}>Add Instructor</Text>

                </TouchableOpacity>

                <TextInput placeholder="Search Instructor" style={{ backgroundColor:'#E8E8E8',
                width:'94%',
                height:48,
                marginTop:20,
                fontSize:17,
                borderRadius:6,
                color:'#929292',
                paddingLeft:10,alignSelf:'center'}} onChangeText={(value)=>{
                        if(value.length>0){
                            this.setState({whole_loading:true})
                        this.setState({search_instructors: this.state.instructors.filter(i=>i._data.name.toLowerCase().includes(value.toLowerCase())),},()=>{
                            this.setState({whole_loading:false})
                        })
                    }else{
                        this.get_all_instructors()
                    }

                   
                }
                }/>


                {this.state.whole_loading == false?this.state.search_instructors.map((data,index)=>{
                    return(
                        <Instructor key={index} get_all_instructors={this.get_all_instructors} navigation={this.props.navigation} data={data}/>

                    )
                }):
                <ActivityIndicator size="large" color="black" style={{alignSelf:'center',marginTop:50}}/>
                
                }


                <Modal isVisible={this.state.showModal}>
            <View style={{ width: '100%',padding:20,backgroundColor:'white',borderRadius:10}}>
            <Text style={{color:'black',textAlign:'center',fontSize:20,fontWeight:'bold',marginTop:10}}>Add Instructor</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
            <TouchableOpacity onPress={() => this.choosePhoto()} >

            {this.state.profile_pic.uri?<Image style={{borderRadius:60,width:60,height:60,alignSelf:'center'}} source={{uri: this.state.profile_pic.uri}}/>:<Image  style={{borderRadius:60,height:60,width:60,alignSelf:'center'}} source={require('../../assets/ProfileImage.png')}/>}

            </TouchableOpacity>

            <View style={styles.EnteringData}>
                    <TextInput style={styles.EmailInput} value={this.state.email} onChangeText={(val)=>this.setState({email:val})} placeholderTextColor="#929292" placeholder="Email"/>

                    <TextInput onChangeText={(val)=>this.setState({name:val})} value={this.state.name} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Name"/>
                    <TextInput style={styles.NameInput} onChangeText={(val)=>this.setState({adi:val})} value={this.state.adi} placeholderTextColor="#929292" placeholder="ADI/PDI"/>
                    <TextInput onChangeText={(val)=>this.setState({phone_no:val})} value={this.state.phone_no} style={styles.NameInput} placeholderTextColor="#929292" placeholder="Phone Number"  keyboardType="numeric"/>

                    
                <View style={styles.PasswordInput}>
                {this.state.showPass == true ? 
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../assets/eye.png')} style={styles.imageStyle}/>
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => this.setState({showPass:!(this.state.showPass)})} style={styles.EyeButton}>
                <Image source={require('../../assets/crosseye.png')} style={styles.CrossEyeIconStyle}/>
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
                
               
          
                </View>
           
               
                {this.state.isLoading?<ActivityIndicator size="large" color="black" style={{alignSelf: "center"}}/>:null}
            <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-between',marginTop:20}}>
                <TouchableOpacity onPress={()=>this.setState({showModal:false})} style={{backgroundColor:'red',justifyContent:'center',alignItems: 'center',borderColor:'red',borderWidth:1,borderRadius:10,width:'42%',padding:5,}}>
                <Text style={{color:'white'}}>Close</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={this.add_instructor} style={{backgroundColor:'skyblue',justifyContent:'center',alignItems: 'center',borderColor:'skyblue',borderWidth:1,borderRadius:10,width:'42%',padding:5,marginLeft:20}}>
                <Text style={{color:'white'}}>Add</Text>
                    
                </TouchableOpacity>


            </View>

            </View>
         </Modal>





            </ScrollView>
        )

  
    }
}

export default AdminInstructor