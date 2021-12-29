import React from 'react'
import {View,Text,TouchableOpacity, ActivityIndicator,TextInput, Alert,Image} from 'react-native'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import * as ImagePicker from "react-native-image-picker"

import styles from './styles'
import {Picker} from '@react-native-picker/picker';

var sec = new Date().getSeconds();
var date = new Date().getDate()
class EditLearner extends React.Component {
    state = {
        name:this.props.route.params.data._data.name,
        description:this.props.route.params.data._data.description,
        allocated_to:this.props.route.params.data._data.allocated_to,
        isLoading:false,
       
        instructors:[],
        whole_loading:true,
      

    }

    get_all_instructors = ()=>{
        
        
        firestore().collection("users").where("is_admin","==",0).get()
        .then(res=>{
          this.setState({instructors:res._docs,whole_loading:false})
        })
      
    } 

  

     


    update_learner = ()=>{
        if(this.state.name.length<1){
            Alert.alert("Name is Required")
            return false
        }

        if(this.state.description.length<1){
            Alert.alert("Description is required")
            return false
        }


        if(this.state.allocated_to.length<1){
            Alert.alert("Allocation is required")
            return false
        }

        
          
            firestore().collection("learner").doc(this.props.route.params.data.id).update({
                name:this.state.name,
                description:this.state.description,
                allocated_to:this.state.allocated_to,
               
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
    
    
    componentDidMount(){
        this.get_all_instructors()
    }


    render(){
        if(this.state.whole_loading == false){

        return (
            <View style={{ width: '100%',padding:20,backgroundColor:'white',borderRadius:10}}>
            <Text style={{color:'black',textAlign:'center',fontSize:20,fontWeight:'bold',marginTop:10}}>Edit Learner</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
           

            <TextInput style={[styles.EmailInput,{marginTop:20}]} value={this.state.name} onChangeText={(val)=>this.setState({name:val})} placeholderTextColor="#929292" placeholder="Name"/>
            <TextInput style={[styles.DescriptionInput,{marginTop:20}]} multiline={true}  numberOfLines = {10} value={this.state.description} onChangeText={(val)=>this.setState({description:val})} placeholderTextColor="#929292" placeholder="Description"/>
            <Picker
             style={[styles.EmailInput,{marginTop:20}]}
            selectedValue={this.state.allocated_to}
            onValueChange={(itemValue, itemIndex) =>
               this.setState({allocated_to:itemValue})
            }>
                <Picker.Item  label="Select Instructor" value='' />

                {this.state.instructors.map((data,index)=>{
                    return(
                        <Picker.Item key={index} label={data._data.name} value={data.id} />

                    )
                })}
            
            </Picker>
                {this.state.isLoading?<ActivityIndicator size="large" color="black" style={{alignSelf: "center"}}/>:null}
          


                <TouchableOpacity onPress={this.update_learner} style={{backgroundColor:'skyblue',justifyContent:'center',alignSelf:'center',alignItems: 'center',borderColor:'skyblue',borderWidth:1,borderRadius:10,width:'42%',padding:5,marginTop:40}}>
                <Text style={{color:'white'}}>Update</Text>
                    
                </TouchableOpacity>


           

            </View>
        )
    }else{
        return <ActivityIndicator size="large" color="black" style={{ alignSelf:'center',marginTop:50 }}/>
    }

    }
}

export default EditLearner