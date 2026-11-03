import { useRef, useState } from "react";
import { Modal, Platform, Text, TextInput, TouchableWithoutFeedback, View, type TextInput as TextInputType } from "react-native";

const PIN_LENGTH = 6;
const PinVerification = ({ correctPin = '123456', onSuccess }: { correctPin?: string; onSuccess: () => void }) => {

    const textRef = useRef<React.ComponentRef<typeof TextInputType>>(null)
    const [pin, setPin] = useState(Array(PIN_LENGTH).fill(''));
    const inputRefs = useRef<(TextInputType | null)[]>([]);

    const handleChangeText = (text : string, index: number) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newPin = [...pin];
        newPin[index] = digit;
        setPin(newPin);

        if (digit && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        }

        if (newPin.every((val) => val !== '')) {
        const enteredPin = newPin.join('');
        if (enteredPin === correctPin) {
            if (onSuccess) onSuccess();
        } else {
            setPin(Array(PIN_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
        if (pin[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newPin = [...pin];
            newPin[index - 1] = '';
            setPin(newPin);
        } else if (pin[index] !== '') {
            const newPin = [...pin];
            newPin[index] = '';
            setPin(newPin);
        }
        }
    };
    return (
    <Modal transparent
    animationType={Platform.OS === 'web' ? 'none' : 'slide'}
    statusBarTranslucent>
        <TouchableWithoutFeedback onPress={() => textRef.current?.focus()}>
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 24,
                ...Platform.select({
                web: { userSelect: 'none' },
                }),
            }}>
            <View style={{
                alignItems: 'center',
                marginBottom: 40,
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#0F172A',
                    marginBottom: 8,
                }}>
                    Enter Passcode
                </Text>

                <Text style={{
                    fontSize: 14,
                    color: '#64748B',
                }}>
                    Please enter your 6-digit security PIN
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {pin.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    style={{
                        width: 24,
                        height: 25,
                        borderRadius: 6,
                        backgroundColor: digit !== '' ? '#ff5424' : 'transparent',
                        caretColor: 'transparent',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 10,
                        fontWeight: '600',
                        color: '#ff5424',
                        borderWidth: 2,
                        borderColor: '#ff5424',
                        ...Platform.select({
                        web: {
                            outlineStyle: 'none',
                        } as any,
                        }),
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    secureTextEntry={true}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                    selectionColor="transparent"
                />
                ))}
            </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
}
export default PinVerification;