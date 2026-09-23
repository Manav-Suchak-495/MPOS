import { useState } from "react";
import { Image, Modal, Platform, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

interface ForgotPasswordDialogInterface {
    forgotPasswordDialog: boolean;
    setForgotPasswordDialog: (args :boolean) => void;
    setUserEmail : (args: string) => void;
}
const ForgotPasswordDialog = ({forgotPasswordDialog, setForgotPasswordDialog, setUserEmail} : ForgotPasswordDialogInterface )=>{
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isLoadin, setIsLoading] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const BackWebHover = Platform.OS === 'web' ? {
        onMouseEnter: () => setIsBackHovered(true),
        onMouseLeave: () => setIsBackHovered(false),
      } : {};

    return(
        
        <Modal
              transparent
              animationType={Platform.OS === 'web' ? 'none' : 'slide'}
              onRequestClose={() => setForgotPasswordDialog(false)}
              statusBarTranslucent>
                <View 
                    style={{
                        width: '100%',
                        marginLeft : 'auto',
                        marginRight: 'auto',
                        height: Platform.OS == 'web' ? 280 : '100%',
                        maxWidth: Platform.OS == 'web' ? 320 : undefined,
                        backgroundColor: Platform.OS == 'web' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0)',
                        borderWidth: 1.5,
                        borderColor: Platform.OS == 'web' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        borderRadius: 12,
                        padding: Platform.OS == 'web' ? 10 : 24,
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
                                width: 50,
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                left: 0,
                                top: 0,
                                zIndex: 10,
                                aspectRatio: 1/1,
                                borderRadius: 50,
                                marginTop: Platform.OS == 'web' ? 0 : 24,
                                backgroundColor: isBackHovered ? 'rgba(150, 150, 150, 0.04)' : 'transparent',
                        },
                            pressed && { backgroundColor: 'rgba(150, 150, 150, 0.09)'},
                        ]}
                        >
                            <Image 
                            source={require('./icons/MPOS_Logo_Black_Final.png')}
                            resizeMode="contain"
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: 24,
                                backgroundColor: 'transparent',
                            }}/>
                        </Pressable>
                        <Text
                            style={{
                                width: '100%',
                                height: 50,
                                textAlign: 'center',
                                alignContent: 'center',
                                paddingBottom: 7,
                                fontSize: 20,
                                fontWeight: '700',
                                color: '#fff',
                        }}>
                            Forgot Password
                        </Text>

                </View>
        </Modal>
    )

}
export default ForgotPasswordDialog;