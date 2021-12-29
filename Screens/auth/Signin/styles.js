import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFFFF',
        padding:'5%'
    },

    EnteringData:{
        width:'100%',

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

    SignUpLink:{
        marginLeft:5
    },

    DontHaveAccount:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:130,
        marginBottom:'10%'
    },

    DontHaveAccountSignUpLink:{
        color:'#242d6f',
        fontSize:17
    },

    DontHaveAccountText:{
        fontSize:17
    },
    LogoBox:{
        width:'100%',
        height:'30%',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:'10%',
        marginTop:'5%'

    },

    Logo:{
        width:230,
        height:121
    }
})

export default styles;