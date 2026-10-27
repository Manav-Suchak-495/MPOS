import axios, { Axios } from "axios";
import { Check, ChevronLeft } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, Platform, Pressable, Text, TouchableOpacity, View, ViewStyle, type TextInput as TextInputType } from "react-native";
import { TextInput } from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native";
import * as SecureStore from 'expo-secure-store';

interface ForgotPasswordDialogInterface {
    forgotPasswordDialog: boolean;
    setForgotPasswordDialog: (args: boolean) => void;
    isForgotPassword: boolean;
    setIsForgotPassword: (args: boolean) => void;
    user_email: string;
    setUserEmail: (args: string) => void;
    API_BASE_URL: string;
    setLoading: (args: boolean) => void;
    isElectron: boolean;
    isOtpVerification: boolean;
    setIsOtpVerification: (args: boolean) => void;
    isSignUp: boolean;
}
const ForgotPasswordDialog = ({forgotPasswordDialog, setForgotPasswordDialog, isForgotPassword, setIsForgotPassword, user_email, setUserEmail, API_BASE_URL, setLoading, isElectron, isOtpVerification, setIsOtpVerification, isSignUp} : ForgotPasswordDialogInterface )=>{
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isForgotHovered, setIsForgotHovered] = useState(false);
    const textRef = useRef<React.ComponentRef<typeof TextInputType>>(null)

    const BackWebHover = Platform.OS === 'web' ? {
        onMouseEnter: () => setIsBackHovered(true),
        onMouseLeave: () => setIsBackHovered(false),
      } : {};

    const forgotPasswordHover = Platform.OS === 'web' ? {
        onMouseEnter: () => setIsForgotHovered(true),
        onMouseLeave: () => setIsForgotHovered(false),
      } : {};
    
    useEffect(()=>{
        if(Platform.OS != 'web'){
            const timer = setTimeout(()=>{
                textRef.current?.focus();
            }, 100);

            return() => { clearTimeout(timer) }
        }
    }, [])

    const handleBlur = () => {
        textRef.current?.focus();
    };

    const handleSendOTP = async () => {
        if(isOtpVerification){
            if (!otp || !/^\d{6}$/.test(otp)) {
                if(Platform.OS == 'web'){
                    window.alert(`${'Validation Error'}\n\n${'Please enter a valid 6-digit OTP'}`);
                }
                else{
                    Alert.alert('Validation Error', 'Please enter a valid 6-digit OTP.');
                }
                return;
            }
            setLoading(true);
            try {
                const response = await axios.post(`${API_BASE_URL}/api/v1/auth/verify-otp`, {"email": user_email, "otp": otp, 'isSignUp' : isSignUp});
                if(response.data?.Authenticated === true && isForgotPassword === false){
                    if(isElectron){
                        if (window.electronAPI) {
                            try {
                                const encrypted = await window.electronAPI.encryptToken(response.data?.ShortToken);
                                localStorage.setItem('ShortToken', encrypted);
                                window.alert('Token Saved');
                            } catch (error) {
                                console.error('Failed to encrypt token via Electron:', error);
                            }
                        } else {
                            localStorage.setItem('ShortToken', response.data?.ShortToken);
                            window.alert('Token Saved');
                        }
                    } 
                    else {
                        try {
                        await SecureStore.setItemAsync('ShortToken', response.data?.ShortToken);
                        Alert.alert('Token Saved');
                        } catch (error) {
                        console.error('Failed to save token in SecureStore:', error);
                        }
                    }
                }
                else{
                    if(isElectron){
                        window.alert('Invalid OTP');
                    }
                    else{
                        Alert.alert('Invalid OTP', 'Please Enter Valid OTP!!!');
                    }
                }
            } catch (error: unknown) {
                console.error('Axios Error Object:', error);
            } finally {
                setLoading(false);
            }
        }
        else{
            if (!email) {
                if(Platform.OS == 'web'){
                    window.alert(`${'Validation Error'}\n\n${'Please enter email to get otp'}`);
                }
                else{
                    Alert.alert('Validation Error', 'Please enter email to get otp.');
                }
                return;
            }
            setLoading(true);
        }
    }

    return(
        
        <Modal
              transparent
              animationType={Platform.OS === 'web' ? 'none' : 'slide'}
              onRequestClose={() => setForgotPasswordDialog(false)}
              statusBarTranslucent>
                <TouchableWithoutFeedback onPress={() => textRef.current?.focus()}>
                <View style={{
                    position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                flex: 1,
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}>
                <View 
                    style={{
                        flex: 1,
                        width: '100%',
                        marginLeft : 'auto',
                        marginRight: 'auto',
                        height: Platform.OS == 'web' ? 252 : '100%',
                        maxWidth: Platform.OS == 'web' ? 290 : undefined,
                        backgroundColor: Platform.OS == 'web' ? 'FCFCFF' : '#FCFCFF',
                        borderWidth: 2.4,
                        borderColor: Platform.OS == 'web' ? '#000000' : 'transparent',
                        borderRadius: 24,
                        paddingHorizontal: Platform.OS == 'web' ? 24 : 24,
                        paddingVertical: Platform.OS == 'web' ? 0 : 24,
                        alignSelf: 'center',
                        ...Platform.select({
                              web: {
                                position: 'fixed' as any,
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                zIndex: 9999,
                                backdropFilter: 'blur(24px)',
                              } as ViewStyle,
                            }),
                    }}>
                        <Pressable
                        onPress={() => {setForgotPasswordDialog(false);
                        setIsOtpVerification(false);
                        }}
                        {...(BackWebHover as any)}
                        android_ripple={null}
                        style={({ pressed }) => [{
                                width: Platform.OS == 'web' ? 30 : 44,
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                left: 0,
                                top: isElectron ? 0 : 1,
                                zIndex: 10,
                                aspectRatio: 1/1,
                                borderRadius: Platform.OS == 'web' ? 24 : 24,
                                paddingVertical: Platform.OS == 'web' ? 2 : 4,
                                paddingLeft: Platform.OS == 'web' ? 1 : 3,
                                paddingRight: Platform.OS == 'web' ? 2 : 6,
                                marginTop: Platform.OS == 'web' ? 6 : 24,
                                marginLeft: Platform.OS == 'web' ? 6 : 9,
                                backgroundColor: isBackHovered ? 'rgba(150, 150, 150, 0.06)' : 'transparent',
                        },
                            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.12)'},
                        ]}>
                            <ChevronLeft size={40} color='#000000' strokeWidth={2} width='100%' height='100%'/>
                        </Pressable>
                        <Text
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                alignContent: 'center',
                                paddingBottom: 7,
                                fontSize: Platform.OS =='web' ? 17 : 20,
                                fontWeight: Platform.OS == 'web' ? '700' : '500',
                                marginTop: Platform.OS == 'web' ? 10 : 9,
                                color: '#000000',
                        }}>
                            {isOtpVerification ? 'Verify OTP' : 'Forgot Password'}
                        </Text>
                        {Platform.OS == 'web' ? null : (<Pressable
                            onPress={ () => { handleSendOTP() }}
                            android_ripple={null}
                            style={({ pressed }) => [{
                                    width: Platform.OS == 'web' ? 32 : 44,
                                    position: 'absolute',
                                    alignSelf: 'flex-start',
                                    right: 4,
                                    top: 2,
                                    zIndex: 10,
                                    aspectRatio: 1/1,
                                    borderRadius: Platform.OS == 'web' ? 9 : 24,
                                    paddingVertical: Platform.OS == 'web' ? 2 : 4,
                                    paddingTop: 7,
                                    paddingBottom: 4,
                                    paddingLeft: Platform.OS == 'web' ? 1 : 7,
                                    paddingRight: Platform.OS == 'web' ? 2 : 5,
                                    marginTop: Platform.OS == 'web' ? 6 : 24,
                                    marginRight: Platform.OS == 'web' ? 6 : 9,
                                    backgroundColor: isBackHovered ? 'rgba(150, 150, 150, 0.06)' : 'transparent',
                        },
                            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.12)'},
                        ]}>
                            <Check size={40} color='#000000' strokeWidth={2} width='100%' height='100%'/>
                        </Pressable>)}
                        <View style={{
                            flex: 1,
                            justifyContent: 'space-between'
                        }}>
                            <View>
                                <TextInput
                                    placeholder= {isOtpVerification ? 'Enter OTP' : 'Enter Email'}
                                    placeholderTextColor='#DFE0E9'
                                    textColor='#000000'
                                    value={isOtpVerification ? otp : email}
                                    ref={textRef}
                                    onChangeText={(text: string) => {
                                        if (isOtpVerification) {
                                            setOtp(text);
                                        } else {
                                            setEmail(text);
                                        }
                                    }}
                                    keyboardType= {isOtpVerification ? "number-pad" : "email-address"}
                                    mode='outlined'
                                    outlineColor='#DFE0E9'
                                    activeOutlineColor='#FF5424'
                                    outlineStyle={{
                                        borderRadius: Platform.OS == 'web' ? 9 : 12,
                                        borderWidth: 1.1
                                    }}
                                    contentStyle={{
                                        fontSize: Platform.OS == 'web' ? 14 : 15,
                                        paddingBottom: Platform.OS == 'web' ? undefined : 2,
                                    }}
                                    style={{
                                        height: Platform.OS == 'web' ? 40 : 50,
                                        minWidth: Platform.OS == 'web' ? '100%' : undefined,
                                        marginTop: Platform.OS == 'web' ? 27 : 40,
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        paddingLeft: Platform.OS == 'web' ? undefined : 9
                                    }}
                                />
                                {isOtpVerification && (<TouchableOpacity
                                    onPress={() => {
                                        
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        fontSize: Platform.OS == 'web' ? 13 : 17,
                                        width: Platform.OS == 'web' ? 'auto' : undefined,
                                        color: '#ffffff',
                                        textAlign: 'right',
                                        marginRight: Platform.OS == 'web' ? 6 : 9,
                                        marginTop: 6
                                    }}>
                                    Resend OTP
                                    </Text>
                                </TouchableOpacity>)}
                            </View>
                            {Platform.OS == 'web' ? (<Pressable
                            onPress={()=>{ handleSendOTP() }}
                            {...(forgotPasswordHover as any)}
                            style={({ pressed }) => [{
                                position: Platform.OS =='web' ? 'absolute' : undefined,
                                bottom: 0,
                                height : Platform.OS == 'web' ? undefined : 50,
                                width: '100%',
                                elevation: 6,
                                marginBottom: Platform.OS == 'web' ? 24 : 24,
                                paddingVertical: 4,
                                borderRadius: 10,
                                backgroundColor: '#FF5424',
                                borderColor: '#fff',
                                shadowColor: isForgotHovered ? '#ff5424' : 'transparent',
                                shadowOffset: { width: isForgotHovered ? 4 : 0, height: isForgotHovered ? 3 : 0 },
                                shadowOpacity: 0.4,
                                shadowRadius: 5,
                                overflow: 'hidden'
                            },
                            pressed && { backgroundColor: '#ff7630' },
                            ]}
                            theme={{
                            colors: { elevation: { level1: 'transparent' } }
                            }}>
                            <Text style={{
                            color: '#ffffff',
                            fontWeight: Platform.OS == 'web' ? '400' : '600',
                            margin: 6,
                            fontSize: Platform.OS == 'web' ? 15 : 19,
                            textAlign: 'center'
                            }}>{isOtpVerification ? 'Verify OTP': 'Send OTP'}</Text>
                        </Pressable>) : null}
                    </View>
                </View>
                </View>
                </TouchableWithoutFeedback>
        </Modal>
    )

}
export default ForgotPasswordDialog;