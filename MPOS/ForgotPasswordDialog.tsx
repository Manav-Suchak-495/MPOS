import { Axios } from "axios";
import { Check, CheckCheck, CheckCircle, CheckLine, ChevronLeft, FileCheck, LucideCheck, Send } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, Modal, Platform, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Button, TextInput } from "react-native-paper";

interface ForgotPasswordDialogInterface {
    forgotPasswordDialog: boolean;
    setForgotPasswordDialog: (args: boolean) => void;
}
const ForgotPasswordDialog = ({forgotPasswordDialog, setForgotPasswordDialog} : ForgotPasswordDialogInterface )=>{
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isForgotHovered, setIsForgotHovered] = useState(false);
    const BackWebHover = Platform.OS === 'web' ? {
        onMouseEnter: () => setIsBackHovered(true),
        onMouseLeave: () => setIsBackHovered(false),
      } : {};

    const forgotPasswordHover = Platform.OS === 'web' ? {
        onMouseEnter: () => setIsForgotHovered(true),
        onMouseLeave: () => setIsForgotHovered(false),
      } : {};

    const handleSendOTP = async () => {
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

    return(
        
        <Modal
              transparent
              animationType={Platform.OS === 'web' ? 'none' : 'slide'}
              onRequestClose={() => setForgotPasswordDialog(false)}
              statusBarTranslucent>
                <View 
                    style={{
                        flex: 1,
                        width: '100%',
                        marginLeft : 'auto',
                        marginRight: 'auto',
                        height: Platform.OS == 'web' ? 255 : '100%',
                        maxWidth: Platform.OS == 'web' ? 285 : undefined,
                        backgroundColor: Platform.OS == 'web' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0)',
                        borderWidth: 1.5,
                        borderColor: Platform.OS == 'web' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        borderRadius: 15,
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
                        onPress={() => setForgotPasswordDialog(false)}
                        {...(BackWebHover as any)}
                        android_ripple={null}
                        style={({ pressed }) => [{
                                width: Platform.OS == 'web' ? 30 : 48,
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                left: 0,
                                top: 0,
                                zIndex: 10,
                                aspectRatio: 1/1,
                                borderRadius: Platform.OS == 'web' ? 9 : 24,
                                paddingVertical: Platform.OS == 'web' ? 2 : 4,
                                paddingLeft: Platform.OS == 'web' ? 1 : 3,
                                paddingRight: Platform.OS == 'web' ? 2 : 6,
                                marginTop: Platform.OS == 'web' ? 6 : 24,
                                marginLeft: Platform.OS == 'web' ? 6 : 9,
                                backgroundColor: isBackHovered ? 'rgba(150, 150, 150, 0.06)' : 'transparent',
                        },
                            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.12)'},
                        ]}>
                            <ChevronLeft size={40} color='#fff' strokeWidth={2} width='100%' height='100%'/>
                        </Pressable>
                        <Text
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                alignContent: 'center',
                                paddingBottom: 7,
                                fontSize: Platform.OS =='web' ? 17 : 22,
                                fontWeight: Platform.OS == 'web' ? '700' : '500',
                                marginTop: Platform.OS == 'web' ? 10 : 9,
                                color: '#fff',
                        }}>
                            Forgot Password
                        </Text>
                        {Platform.OS == 'web' ? null : (<Pressable
                            onPress={ () => { handleSendOTP() }}
                            android_ripple={null}
                            style={({ pressed }) => [{
                                    width: Platform.OS == 'web' ? 32 : 48,
                                    position: 'absolute',
                                    alignSelf: 'flex-start',
                                    right: 0,
                                    top: 0,
                                    zIndex: 10,
                                    aspectRatio: 1/1,
                                    borderRadius: Platform.OS == 'web' ? 9 : 24,
                                    paddingVertical: Platform.OS == 'web' ? 2 : 4,
                                    paddingTop: 9,
                                    paddingLeft: Platform.OS == 'web' ? 1 : 7,
                                    paddingRight: Platform.OS == 'web' ? 2 : 5,
                                    marginTop: Platform.OS == 'web' ? 6 : 24,
                                    marginRight: Platform.OS == 'web' ? 6 : 9,
                                    backgroundColor: isBackHovered ? 'rgba(150, 150, 150, 0.06)' : 'transparent',
                        },
                            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.12)'},
                        ]}>
                            <Check size={40} color='#fff' strokeWidth={2} width='100%' height='100%'/>
                        </Pressable>)}
                        <View style={{
                            flex: 1,
                            justifyContent: 'space-between'
                        }}>
                            <View>
                                <TextInput
                                    placeholder='Email'
                                    placeholderTextColor='#f0f0f0'
                                    textColor='#f0f0f0'
                                    value={email}
                                    onChangeText={(text: string) => setEmail(text)}
                                    mode='outlined'
                                    outlineColor='rgba(255, 255, 255, 0.24)'
                                    activeOutlineColor='#ffffff'
                                    outlineStyle={{
                                        borderRadius: Platform.OS == 'web' ? 9 : 32,
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
                                {isEmailVerified && (<TouchableOpacity
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
                            onPress={()=>{}}
                            {...(forgotPasswordHover as any)}
                            android_ripple={{
                            color: '#811ccf',
                            borderless: false
                            }}
                            style={({ pressed }) => [{
                                position: Platform.OS =='web' ? 'absolute' : undefined,
                                bottom: 0,
                                height : Platform.OS == 'web' ? undefined : 50,
                                width: '100%',
                                elevation: 6,
                                marginBottom: Platform.OS == 'web' ? 24 : 24,
                                paddingVertical: 4,
                                borderRadius: 10,
                                backgroundColor: '#660eca',
                                borderColor: '#fff',
                                shadowColor: isForgotHovered ? '#2d2d2d' : 'transparent',
                                shadowOffset: { width: isForgotHovered ? 4 : 0, height: isForgotHovered ? 3 : 0 },
                                shadowOpacity: 0.4,
                                shadowRadius: 5,
                                overflow: 'hidden'
                            },
                            pressed && Platform.OS === 'ios' && { backgroundColor: '#811ccf' },
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
                            }}>Send OTP</Text>
                        </Pressable>) : null}
                    </View>
                </View>
        </Modal>
    )

}
export default ForgotPasswordDialog;