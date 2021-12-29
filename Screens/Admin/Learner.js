import  React from 'react'
import {View,Text,TouchableOpacity,ScrollView,Image, Alert} from 'react-native'
import storage from '@react-native-firebase/storage'
import AsyncStorage from 'react-native'
import ReadMore from '@fawazahmed/react-native-read-more';
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default class Learner extends React.Component {
    state = {

        profile_pic:'',
        allocated_to:''
    }



      
    

    delete_learner = ()=>{
           
           
                firestore().collection("learner").doc(this.props.data.id).delete()
                .then(res=>{
                    
                    this.props.get_all_learners()
                })
                .catch(err=>{
                    Alert.alert("Something Went Wrong")
                })
           
    }


    allocated_to = ()=>{
        console.log(this.props.data._data)
        firestore().collection("users").doc(this.props.data._data.allocated_to).get()
        .then(res=>{
          this.setState({allocated_to:res._data.name})
        })
    }

    componentDidMount(){
        this.allocated_to()
    }

  
    render(){
        return(
            <View style={{width:'98%',padding:10,backgroundColor:'#242d6f',borderColor:'#242d6f',alignSelf:'center',borderWidth:1,borderRadius:10,marginTop:20}}>
                     <View style={{flexDirection:'row',marginLeft:'84%'}}>
                     
                     <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditLearner',{data:this.props.data})} style={{right:30}}>
                    <FontAwesome name="edit" color="skyblue" size={25}/>
                    </TouchableOpacity>


                     <TouchableOpacity onPress={this.delete_learner} >
                    <FontAwesome name="trash" color="red" size={25}/>
                    </TouchableOpacity>

                  


                     </View>
                    


           
       
            <Text style={{color:'white',fontSize:17,textAlign:'center',marginTop:5}}>{this.props.data._data.name}</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
           <Text style={{fontSize: 14,marginTop:8,color:'white'}} selectable>{this.props.data._data.description}</Text>
          
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>

           <Text style={{fontSize: 14,marginTop:8,color:'white'}}>Status : {this.props.data._data.status}</Text>
          
            <Text style={{fontSize:15,color:'white',fontWeight:'bold',marginTop:5}}>Allocated To : {this.state.allocated_to}</Text>

            </View>
        )
    }
}