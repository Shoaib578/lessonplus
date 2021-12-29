import  React from 'react'
import {View,Text,TouchableOpacity,ScrollView,Image, Alert} from 'react-native'
import storage from '@react-native-firebase/storage'
import AsyncStorage from 'react-native'
import ReadMore from '@fawazahmed/react-native-read-more';
import firestore from '@react-native-firebase/firestore'
import {Picker} from '@react-native-picker/picker';

export default class Learner extends React.Component {
    state = {
        status:''
    }
    change_status=(status)=>{
        firestore().collection('learner').doc(this.props.data.id).update({
            status:status
        })
        .then(res=>{
           
            Alert.alert("Status Updated")
        })
    }

   

    componentDidMount(){
        this.setState({status:this.props.data._data.status})
    }
   
    render(){
        return(
            <View style={{width:'98%',padding:10,backgroundColor:'#242d6f',borderColor:'#242d6f',alignSelf:'center',borderWidth:1,borderRadius:10,marginTop:20}}>
            <Text style={{color:'white',fontSize:17,textAlign:'center',marginTop:5}}>{this.props.data._data.name}</Text>
            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>
            <Text style={{fontSize: 14,marginTop:8,color:'white'}} selectable>{this.props.data._data.description}</Text>

            <Text style={{height:0,width:'100%',borderColor:'#00ffff',borderWidth:.5,marginTop:5}}> </Text>

           <Text style={{fontSize: 14,marginTop:8,color:'white'}}>Status : {this.state.status}</Text>
            <Picker
             style={{ backgroundColor:'#F2F2F7',
             width:'100%',
             height:48,
             fontSize:17,
             borderRadius:6,
             color:'#929292',
             borderRadius:5,
             paddingLeft:10,marginTop:20}}
            selectedValue={this.state.status}
            onValueChange={(itemValue, itemIndex) =>{
                this.setState({status:itemValue})
                if(itemValue.length > 0){
                    this.change_status(itemValue)
                }

            }

               
            }>
                <Picker.Item  label="Status" value='' />
                <Picker.Item  label="Discussed" value='Discussed' />
                <Picker.Item  label="Booked" value='Booked' />
                <Picker.Item  label="No Interest" value='No Interest' />
                <Picker.Item  label="No Reply" value='No Reply' />

            
            </Picker>



           


            </View>
        )
    }
}