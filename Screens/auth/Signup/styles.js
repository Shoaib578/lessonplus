import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFFFF',
        paddingRight:'5%',
        paddingLeft:'5%'
    },

    BackArrow:{
        width:8.49,
        height:14
    },

    BackText:{
        color:'#5FA7C0',
        fontSize:16,
        marginLeft:5
    },

    Back:{
        flexDirection:'row',
        alignItems:'center',
        width:'15%'
    },

    EnteringData:{
        width:'100%',
        marginTop:20

    },

    EmailInput:{
        backgroundColor:'#F2F2F7',
        width:'100%',
        height:48,
        fontSize:17,
        borderRadius:6,
        color:'#929292',
        paddingLeft:10
        
    },

    NameInput:{
        backgroundColor:'#F2F2F7',
        width:'100%',
        height:48,
        fontSize:17,
        borderRadius:6,
        color:'#929292',
        paddingLeft:10,
        marginTop:'3%',
        
    },

    PasswordInput:{
        backgroundColor:'#F2F2F7',
        width:'100%',
        height:48,
        fontSize:17,
        borderRadius:6,
        marginTop:'3%',
        color:'#929292',
        flexDirection:'row-reverse',
        justifyContent:'space-between'
    },

    imageStyle: {
        padding: 0,
        height: 24,
        width: 24,
        resizeMode: 'stretch',
        alignItems: 'center',
    },

    CrossEyeIconStyle: {
        padding: 0,
        height: 18.92,
        width: 19.93,
        resizeMode: 'stretch',
        alignItems: 'center',
    },

    InputField:{
        flex:1,
        fontSize:17,
        color:'#929292',
        paddingLeft:10
    },

    LoginButton:{
        width:'100%',
        height:48,
        borderRadius:15,
        backgroundColor:'#242d6f',
        justifyContent:'center',
        alignItems:'center',
        marginTop:'5%'
    },

    LoginButtonText:{
        color:'#fff',
        fontSize:20
    },

    EyeButton:{
        margin:12,
        marginRight:20,
    },

    SignInLink:{
        marginLeft:5
    },

    AlreadyHaveAccount:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:50,
        marginBottom:'10%'
    },

    AlreadyHaveAccountSignInLink:{
        color:'#242d6f',
        fontSize:17
    },

    DontHaveAccountText:{
        fontSize:17
    },


    Logo:{
        width:230,
        height:121
    },

    ProfileImage:{
        width:80,
        height:80,
        backgroundColor:'#242d6f',
        borderRadius:40,
        alignSelf:'center',
        marginTop:20
       
    },

    ProfileImageIcon:{
        width:'100%',
        height:'100%'
    },

    dropDown:{
        marginTop:'3%',
        width:'100%',
        backgroundColor:'#FFFFFF',
        borderBottomColor:'#7C7C7C',
        borderBottomWidth:0.7,
      }
})

export default styles;