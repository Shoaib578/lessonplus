import React from 'react'
import {View,Text, Button, TouchableOpacity,TextInput,Image, ScrollView, Alert, ActivityIndicator} from 'react-native'
import Modal from "react-native-modal";
import styles from './styles'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import * as ImagePicker from "react-native-image-picker"
import {Picker} from '@react-native-picker/picker';
import Learner from './Learner';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'

var sec = new Date().getSeconds();
var date = new Date().getDate()
class OneInstructorLearners extends React.Component {
    state = {
        showModal:false,
        name:'',
        uri:'',
        profile_pic:'',
        description:'',
        imageName:'',
        isLoading:false,
        instructors:[],
        allocated_to:'',
        whole_loading:true,
        learners:[],
        searched_learners:[]
    }

   


      get_all_learners = ()=>{
          firestore().collection("learner").where("allocated_to","==",this.props.route.params.id).get()
          .then(res=>{
              
            this.setState({learners:res._docs,})
            this.setState({searched_learners:this.state.learners},()=>{
                this.setState({whole_loading:false})
            })
          })
          .catch(()=>{
              this.setState({whole_loading:false})
          })
      }

     

  

    componentDidMount(){
        this.props.navigation.addListener("focus",()=>{
            this.setState({whole_loading:true})
         
           
            this.get_all_learners()
         
           
        })
      
        this.get_all_learners()
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
                paddingLeft:10,alignSelf:'center'}} 
                
                onChangeText={(value)=>{
                    if(value.length>0){
                       
                    this.setState({searched_learners: this.state.learners.filter(i=>i._data.name.toLowerCase().includes(value.toLowerCase())),})
                }else{
                    this.get_all_learners()
                }
            }
            }
                
                />

                {this.state.whole_loading == false?this.state.searched_learners.map((data,index)=>{
                    return(
                        <Learner navigation={this.props.navigation} get_all_learners={this.get_all_learners} key={index} data={data}/>
                    )
                }):
               <ActivityIndicator size="large" color="black" style={{alignSelf: 'center',marginTop:50}}/>
                
                }






            <Modal isVisible={this.state.showModal}>
            <View style={{ width: '100%',padding:20,backgroundColor:'white',borderRadius:10}}>
            <Text style={{color:'black',textAlign:'center',fontSize:20,fontWeight:'bold',marginTop:10}}>Add Learner</Text>
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
            <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-between',marginTop:20}}>
                <TouchableOpacity onPress={()=>this.setState({showModal:false})} style={{backgroundColor:'red',justifyContent:'center',alignItems: 'center',borderColor:'red',borderWidth:1,borderRadius:10,width:'42%',padding:5,}}>
                <Text style={{color:'white'}}>Close</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={this.add_learner} style={{backgroundColor:'skyblue',justifyContent:'center',alignItems: 'center',borderColor:'skyblue',borderWidth:1,borderRadius:10,width:'42%',padding:5,marginLeft:20}}>
                <Text style={{color:'white'}}>Add</Text>
                    
                </TouchableOpacity>


            </View>

            </View>
         </Modal>

            </ScrollView>
        )
    

    }
}

export default OneInstructorLearners