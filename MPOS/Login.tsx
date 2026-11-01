import axios from "axios";
import { Eye, EyeOff, LucideLogIn } from "lucide-react-native";
import { use, useState } from "react";
import { Alert, Image, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper"

interface LoginInterface {
  user_email: string;
  setUserEmail: (args: string) => void;
  isForgotPassword: boolean;
  setIsForgotPassword: (args: boolean) => void;
  forgotPasswordDialog: boolean;
  setForgotPasswordDialog: (args: boolean) => void;
  API_BASE_URL: string;
  setLoading: (args: boolean) => void;
  isElectron: boolean;
  isOtpVerification: boolean;
  setIsOtpVerification: (args: boolean) => void;
  isSignUp: boolean;
  setIsSignUp: (args: boolean) => void;
}

const Login = ({forgotPasswordDialog, setForgotPasswordDialog, isForgotPassword, setIsForgotPassword, API_BASE_URL, isElectron, setLoading, isOtpVerification, setIsOtpVerification, user_email, setUserEmail, isSignUp, setIsSignUp} : LoginInterface) =>{
    const [password, setPassword] = useState('');
    const [isLoginHovered, setIsLoginHovered] = useState(false);
    const [isBackLoginHovered, setIsBackLoginHovered] = useState(false);
    const [passEyeToggle, setPassEyeToggle] = useState(true);
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpName, setSignUpName] = useState('');
    const [signUpMobile, setSignUpMobile] = useState('');
    const [signUpCreatePassword, setSignUpCreatePassword] = useState('');
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
    const [signUpCreatePasswordToggle, setSignUpCreatePasswordToggle] = useState(true);
    const [signUpConfirmPasswordToggle, setSignUpConfirmPasswordToggle] = useState(true)
    const [isSignUpHovered, setIsSignUpHovered] = useState(false)

    const LoginWebHover = Platform.OS === 'web' ? {
      onMouseEnter: () => setIsLoginHovered(true),
      onMouseLeave: () => setIsLoginHovered(false),
    } : {};
    const BackLoginWebHover = Platform.OS === 'web' ? {
      onMouseEnter: () => setIsBackLoginHovered(true),
      onMouseLeave: () => setIsBackLoginHovered(false),
    } : {};
    const SignUpWebHover = isElectron ? {
      onMouseEnter: () => setIsSignUpHovered(true),
      onMouseLeave: () => setIsSignUpHovered(false),
    } : {};

  const handleSignUp = async() =>{
    if(!signUpName || !signUpEmail || !signUpMobile || !signUpCreatePassword || !signUpConfirmPassword){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please Enter All Fields to SignUp.'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please Enter All Fields to SignUp.');
      }
      return;
    }
    if(!/^[a-zA-Z\s]+$/.test(signUpName)){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please Enter Valid Name'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please Enter Valid Name.');
      }
      return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail)){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please Enter Valid Email Address'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please Enter Valid Email Address.');
      }
      return;
    }
    if(signUpMobile.length !== 10 || !/^\d+$/.test(signUpMobile)){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please Enter Valid Mobile Number'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please Enter Valid Mobile Number.');
      }
      return;
    }
    if(signUpCreatePassword.length < 8){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Password must be at least 8 characters long'}`);
      }
      else{
        Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
      }
      return;
    }
    if(!/\d/.test(signUpCreatePassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(signUpCreatePassword) || !/[A-Z]/.test(signUpCreatePassword) || !/[a-z]/.test(signUpCreatePassword)){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Password must contain at least one of each: number, special character, uppercase letter, and lowercase letter'}`);
      }
      else{
        Alert.alert('Validation Error', 'Password must contain at least one of each: number, special character, uppercase letter, and lowercase letter.');
      }
      return;
    }
    if(signUpCreatePassword !== signUpConfirmPassword){
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Passwords do not match'}`);
      }
      else{
        Alert.alert('Validation Error', 'Passwords do not match.');
      }
      return;
    }
    setLoading(true);
    try{
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signupotpverify`, {name: signUpName, email: signUpEmail, mobile: signUpMobile, password: signUpConfirmPassword,});
      if(response.data?.isSignUpVerified === true){
        setUserEmail(signUpEmail)
        setIsOtpVerification(true);
        setForgotPasswordDialog(true);
      }
      else{
        if(isElectron){
        window.alert(`${'Sign Up Error'}\n\n${'Account Already Exists!!!'}`);
      }
      else{
        Alert.alert('Sign Up Error', 'Account Already Exists!!!');
      }
      return;
      }
    }catch(error: unknown){
      console.error('Axios Error Object:', error);
      let errorMessage = 'Cannot connect to server';
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;

        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          // Handles Pydantic / FastAPI 422 validation error arrays
          errorMessage = detail.map((err) => err.msg).join('\n');
        } else if (error.response?.status === 401) {
          errorMessage = 'Invalid email or password.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      if(isElectron){
        window.alert(`Error: ${errorMessage}`);
      }
      else{
        Alert.alert('Error', errorMessage);
      }
    }finally{
      setLoading(false)
    }

  }
  const handleLogin = async ()=> {
    if (!user_email || !password) {
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please Enter Username and Password'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please Enter Username and Password.');
      }
      return;
    }
    setLoading(true);
    try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {email: user_email,password: password,});
      if(response.data?.isEmailVerified === true){
          setIsOtpVerification(true);
          setForgotPasswordDialog(true);
      }
      else{
        if(isElectron){
          window.alert('Invalid Credentials')
        }
        else{
          Alert.alert('Invalid Credentials', 'Please Enter Valid Username or Password!!!');
        }
      }
    }catch(error: unknown){
      console.error('Axios Error Object:', error);
      let errorMessage = 'Cannot connect to server';
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;

        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          // Handles Pydantic / FastAPI 422 validation error arrays
          errorMessage = detail.map((err) => err.msg).join('\n');
        } else if (error.response?.status === 401) {
          errorMessage = 'Invalid email or password.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      if(isElectron){
        window.alert(`Error: ${errorMessage}`);
      }
      else{
        Alert.alert('Error', errorMessage);
      }
    }finally{
      setLoading(false);
    }
  };


  return(
    <View style={{
      //display : forgotPasswordDialog ? 'none' : undefined,
      flex: 1,
      justifyContent: isElectron ? undefined : 'center',
      alignItems: isElectron ? 'center' : 'stretch',
      minHeight: isElectron ? 480 :'100vh' as any,
      maxHeight: isElectron ? 480 :'100vh' as any,
      width: '100%',
      maxWidth : isElectron ? 720 : '100%',
      backgroundColor: '#FCFCFF',
      borderWidth: 2.7,
      borderColor: isElectron ? '#000000' : 'transparent',
      paddingHorizontal: isElectron ? 24 : 24,
      paddingBottom:  isElectron ? 18 : 24,
      borderRadius: isElectron ? 30 : 0,
    }}>

      {/* Head Camara Design*/}

      {isElectron && (
        <View style={{
          display: 'flex',
          alignSelf: 'center',
          alignItems: isElectron ? 'center' : 'stretch',
          height: 24,
          width: 110,
          backgroundColor: '#000000',
          borderEndEndRadius: 9,
          borderEndStartRadius: 9,
          justifyContent :'center',
        }}>
          <View style={{
            width: 12.5,
            height: 12.5,
            marginLeft: 16,
            marginBottom: 3,
            borderRadius: 15,
            alignSelf: 'flex-start',
            backgroundColor: '#242424',
          }}/>
        </View>)}

        {isSignUp && (<Pressable
            {...(BackLoginWebHover as any)}
            onPress={ () => { 
              setIsSignUp(false);
              setSignUpName('');
              setSignUpEmail('');
              setSignUpMobile('');
              setSignUpCreatePassword('');
              setSignUpConfirmPassword('');
            }}
            style={({ pressed }) => [{
                    width: Platform.OS == 'web' ? 32 : 40,
                    position: 'absolute',
                    alignSelf: 'flex-start',
                    right: 4,
                    top: 3,
                    zIndex: 10,
                    aspectRatio: 1/1,
                    borderRadius: Platform.OS == 'web' ? 24 : 24,
                    paddingVertical: Platform.OS == 'web' ? 2 : 4,
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: Platform.OS == 'web' ? 2 : 7,
                    paddingRight: Platform.OS == 'web' ? 4 : 7,
                    marginTop: Platform.OS == 'web' ? 6 : 30,
                    marginRight: Platform.OS == 'web' ? 6 : 13,
                    backgroundColor: isBackLoginHovered ? 'rgba(150, 150, 150, 0.06)' : 'transparent',
        },
            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.12)'},
        ]}>
            <LucideLogIn size={40} color='#000000' strokeWidth={2} width='100%' height='100%'/>
        </Pressable>)}

        {/* Left*/}

        <View style = {{
          flex: 1,
          flexDirection: 'row',
          gap: 18,
          justifyContent: isElectron ? undefined : 'center',
          width: '100%',
          maxWidth : isElectron ? 700 : '100%',
          backgroundColor: '#FCFCFF',
          borderColor: isElectron ? '#000000' : 'transparent',
        }}>
          {isElectron && (<View style={{
            width: '50%',
            height: '100%',
            }}>
            <View style={{
              height: 60,
              width: '56%',
              marginBottom: 10
            }}>
            <Image source={require('./icons/Barflow_Orange_Flow.png')}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
            }}/>
            </View>
          <View>
            <Text style={{
              color: '#000000',
              fontSize: 15,
              fontWeight: 700,
              textAlign: 'justify'
            }}>Smart POS with Barcode Billing and Inventory Intelligence.</Text>
            <Text style={{
            color: '#ff5424',
            fontSize: 15,
            fontWeight: 700,
            }}>Powered by Instant AI Insights.</Text>
            <Text style={{
            color: '#000000',
            fontSize: 15,
            fontWeight: 600,
            textAlign: 'justify'
            }}>Run your counter Effortlessly and Track every stock move with real-time intelligence.</Text>
          </View>
        </View>)}

        {/* Right*/}
      
        {isSignUp ? 
        
        //SignUp

        (<View style={{
          flex: 1,
          paddingLeft : isElectron ? 24 : 0,
          justifyContent: undefined,
        }}>

          <Text style={{
            color: '#FF5424',
            marginTop: isElectron ? 4 : 24,
            marginBottom: isElectron ? 18 : 24,
            fontWeight: '700',
            fontSize: isElectron ? 27: 36,
            textAlign: 'center'
          }}>
            Sign Up
          </Text>

          <TextInput
            placeholder='Name'
            placeholderTextColor='#BFBFC4'
            textColor='#000000'
            value={signUpName}
            onChangeText={(text: string) => setSignUpName(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9:12,
              borderWidth: 1.2
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />
          <TextInput
            placeholder='Email'
            placeholderTextColor='#BFBFC4'
            textColor='#000000'
            value={signUpEmail}
            onChangeText={(text: string) => setSignUpEmail(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9:12,
              borderWidth: 1.2
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />
          <TextInput
            placeholder='Mobile Number'
            placeholderTextColor='#BFBFC4'
            textColor='#000000'
            value={signUpMobile}
            onChangeText={(text: string) => setSignUpMobile(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9:12,
              borderWidth: 1.2
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />

          <TextInput
            placeholder='Create Password'
            placeholderTextColor='#BFBFC4'
            secureTextEntry={signUpCreatePasswordToggle}
            textColor='#000000'
            value={signUpCreatePassword}
            onChangeText={(text: string) => setSignUpCreatePassword(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9 : 12,
              borderWidth: 1
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            right={
              <TextInput.Icon
                icon={(props) => 
                  passEyeToggle ? (<Eye {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>) : (<EyeOff {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>)
                }
                onPress={() => setSignUpCreatePasswordToggle(!signUpCreatePasswordToggle)}
                forceTextInputFocus={false}
              />
            }
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}
          />
          <TextInput
            placeholder='Confirm Password'
            placeholderTextColor='#BFBFC4'
            secureTextEntry={signUpConfirmPasswordToggle}
            textColor='#000000'
            value={signUpConfirmPassword}
            onChangeText={(text: string) => setSignUpConfirmPassword(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9 : 12,
              borderWidth: 1
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            right={
              <TextInput.Icon
                icon={(props) => 
                  passEyeToggle ? (<Eye {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>) : (<EyeOff {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>)
                }
                onPress={() => setSignUpConfirmPasswordToggle(!signUpConfirmPasswordToggle)}
                forceTextInputFocus={false}
              />
            }
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 6 : 6,
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}
          />
          
          {/*SignUp Footer*/}
          <View style={{
            flex: 1,
            width: '100%',
            justifyContent: isElectron ? 'flex-start' : 'flex-end'
          }}>
            <Pressable
              onPress={() => handleSignUp()}
              {...(SignUpWebHover as any)}
              style={({ pressed }) => [{
                      height : isElectron ? undefined : 50,
                      width: '100%',
                      elevation: 6,
                      marginTop: isElectron ? 24 : 50,
                      marginBottom: isElectron ? 0 : 4,
                      paddingVertical: 4,
                      borderRadius: isElectron ? 9 : 12,
                      backgroundColor: '#000000',
                      borderColor: '#242424',
                      shadowColor: isSignUpHovered ? '#101010' : 'transparent',
                      shadowOffset: { width: isSignUpHovered ? 4 : 0, height: isSignUpHovered ? 6 : 0 },
                      shadowOpacity: 0.15,
                      shadowRadius: 5,
                      overflow: 'hidden'
              },
                pressed && { backgroundColor: '#fff' },
              ]}
              theme={{
                colors: { elevation: { level1: 'transparent' } }
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontWeight: Platform.OS == 'web' ? '400' : '600',
                  margin: 6,
                  fontSize: isElectron ? 15 : 19,
                  textAlign: 'center'
                }}>Sign Up</Text>
              </Pressable>
          </View>
        </View>) 
        :
        
        //Login
        
        (<View style={{
          flex: 1,
          paddingLeft : isElectron ? 24 : 0,
          justifyContent: undefined,
        }}>

          <View style={{
            width: '100%',
            alignItems: isElectron ? 'center' : undefined
          }}>
            <Image source={ isElectron ? require('./icons/Barflow_Emblem_Orange.png') : require('./icons/Barflow_Orange_Flow.png')}
              resizeMode="contain"
              style={{
              marginTop: isElectron ? 24 : 48,
              marginBottom: isElectron ? 30 : 24,
              marginRight: isElectron ? 0 : 10,
              width: isElectron ? 124 : 'auto',
              height: 80
            }}/>
          </View>

          <TextInput
            placeholder='Email'
            placeholderTextColor='#BFBFC4'
            textColor='#000000'
            value={user_email}
            onChangeText={(text: string) => setUserEmail(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9:12,
              borderWidth: 1.2
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />

          <TextInput
            placeholder='Password'
            placeholderTextColor='#BFBFC4'
            secureTextEntry={passEyeToggle}
            textColor='#000000'
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            mode='outlined'
            outlineColor='#DFE0E9'
            activeOutlineColor='#ff5424'
            outlineStyle={{
              borderRadius: isElectron ? 9 : 12,
              borderWidth: 1
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            right={
              <TextInput.Icon
                icon={(props) => 
                  passEyeToggle ? (<Eye {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>) : (<EyeOff {...props} size={Platform.OS == 'web'? 18 : 24} color='#000000'/>)
                }
                onPress={() => setPassEyeToggle(!passEyeToggle)}
                forceTextInputFocus={false}
              />
            }
            style={{
              height: isElectron ? 40 : 50,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 6 : 6,
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}
          />

          <View style={{
            width: '100%',
            marginRight: isElectron ? 6 : 9
          }}>
            <TouchableOpacity
              onPress={() => {
                setForgotPasswordDialog(true)
              }}
              activeOpacity={1}
            >
              <Text style={{
                fontSize: isElectron ? 14 : 17,
                color: '#ff6024',
                textAlign: 'right',
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Right Login Footer*/}

          <View style={{
            flex: 1,
            width: '100%',
            justifyContent: isElectron ? 'flex-start' : 'flex-end'
          }}>
            <Pressable
              onPress={() => handleLogin()}
              {...(LoginWebHover as any)}
              style={({ pressed }) => [{
                      height : isElectron ? undefined : 50,
                      width: '100%',
                      elevation: 6,
                      marginTop: isElectron ? 60 : 50,
                      paddingVertical: 4,
                      borderRadius: isElectron ? 9 : 12,
                      backgroundColor: '#000000',
                      borderColor: '#fff',
                      shadowColor: isLoginHovered ? '#101010' : 'transparent',
                      shadowOffset: { width: isLoginHovered ? 4 : 0, height: isLoginHovered ? 6 : 0 },
                      shadowOpacity: 0.15,
                      shadowRadius: 5,
                      overflow: 'hidden'
              },
                pressed && { backgroundColor: '#242424' },
              ]}
              theme={{
                colors: { elevation: { level1: 'transparent' } }
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontWeight: Platform.OS == 'web' ? '400' : '600',
                  margin: 6,
                  fontSize: isElectron ? 15 : 19,
                  textAlign: 'center'
                }}>Login</Text>
              </Pressable>
            

              <TouchableOpacity
              onPress={() => {
                setIsSignUp(true);
                setUserEmail('');
                setPassword('');
              }}
              activeOpacity={1}
              >
                <Text style={{
                  color: '#000',
                  fontWeight: Platform.OS == 'web' ? '500' : '600',
                  marginTop: isElectron ? 6 : 6,
                  marginBottom: isElectron ? 0 : 24,
                  fontSize: isElectron ? 12 : 14,
                  textAlign: 'center'
                }}>Don't have an Account? Sign Up</Text>
              </TouchableOpacity>
          </View>
        </View>)}
      </View>
    </View>
  )
}
export default Login