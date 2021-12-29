import  React from 'react'
import {View,Text,TouchableOpacity,ScrollView,Image, Alert} from 'react-native'
import storage from '@react-native-firebase/storage'
import AsyncStorage from 'react-native'
import ReadMore from '@fawazahmed/react-native-read-more';
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default class Instructor extends React.Component {
    state = {

        profile_pic:'',
        how_many_allocations:0,
        
    }

    getImage = ()=>{
        storage()
        .ref('profile_pics/' + this.props.data._data.profile_pic) //name in storage in firebase console
        .getDownloadURL()
        .then((url) => {
            console.log(url)
         this.setState({profile_pic:url})
        })
        .catch((e) => console.log('Errors while downloading => ', e));
    }


      
    

    delete_instructor = ()=>{
            storage()
            .refFromURL(this.state.profile_pic).delete()
            .then(()=>{
                firestore().collection("users").doc(this.props.data.id).delete()
                .then(res=>{
                    
                    this.props.get_all_instructors()
                })
                .catch(err=>{
                    Alert.alert("Something Went Wrong")
                })
            })
            .catch(err=>{
                Alert.alert("Something Went Wrong")
            })
      
    }

    how_many_allocations = ()=>{
        firestore().collection("learner").where("allocated_to","==",this.props.data.id).get()
        .then(res=>{
           
            this.setState({how_many_allocations:res.size})
        })
    }


    componentDidMount(){
        this.getImage()
        this.how_many_allocations()
    }
    render(){
        return(
            <View style={{width:'98%',padding:10,backgroundColor:'#242d6f',borderColor:'#242d6f',alignSelf:'center',borderWidth:1,borderRadius:10,marginTop:20}}>
                     <View style={{flexDirection:'row',marginLeft:'84%'}}>
                     
                     <TouchableOpacity onPress={()=>this.props.navigation.navigate('EdiInstructor',{data:this.props.data,prev_uri:this.state.profile_pic})} style={{right:30}}>
                    <FontAwesome name="edit" color="skyblue" size={25}/>
                    </TouchableOpacity>


                     <TouchableOpacity onPress={this.delete_instructor} >
                    <FontAwesome name="trash" color="red" size={25}/>
                    </TouchableOpacity>

                  


                     </View>
                    

            <TouchableOpacity onPress={()=>this.props.navigation.navigate('OneInstructorLearners',{id:this.props.data.id})}>
            <Image source={this.state.profile_pic?{uri:this.state.profile_pic}:require('../../assets/ProfileImage.png')} style={{width:80,height:80,borderRadius:80,alignSelf:'center'}} />

            </TouchableOpacity>
       
            <Text style={{color:'white',fontSize:17,textAlign:'center',marginTop:5}}>{this.props.data._data.name}</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
            

           

                <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10 }}>
                <Text style={{ fontSize:15,color:'white',fontWeight:'bold' }}>Phone Number : </Text>
                <Text style={{ right:20,fontSize:15,color:'white' }}>{this.props.data._data.phone_no}</Text>
                </View>
                <Text style={{height:0,borderColor:'#00ffff',borderWidth:.5,marginTop:5,textAlign:'center',width:'100%'}}> </Text>

                <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10 }}>
                <Text style={{ fontSize:15,color:'white',fontWeight:'bold' }}>Payment Scheme : </Text>
                <Text style={{ right:20,fontSize:15,color:'white' }}>{this.props.data._data.payment_scheme}</Text>
                </View>
                <Text style={{height:0,borderColor:'#00ffff',borderWidth:.5,marginTop:5,textAlign:'center',width:'100%'}}> </Text>
                
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10 }}>
                <Text style={{ fontSize:15,color:'white',fontWeight:'bold' }}>How many Allocations : </Text>
                <Text style={{ right:20,fontSize:15,color:'white' }}>{this.state.how_many_allocations}</Text>
                </View>
            </View>
        )
    }
}