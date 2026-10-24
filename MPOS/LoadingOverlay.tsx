import { ActivityIndicator, View } from "react-native";

const LoadingOverlay = () =>{
    return(
        <View 
            style={{
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
            }}
        >
            <ActivityIndicator color='#FF5424' size={"large"} style={{ transform: [{ scale: 1.8 }] }}/>
        </View>
    )
}
export default LoadingOverlay;