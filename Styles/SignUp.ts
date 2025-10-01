import Colors from "@/assets/Colors";
import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingHorizontal: 5,
    },
    header: {
        backgroundColor: Colors.black,
        height: 200,
        alignItems: 'center',
        position: 'fixed',
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 90,
    },
    body: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 60,
        paddingHorizontal: 20,
    },
    bodyText: {
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 100,
        fontSize: 30,
        fontWeight: 'bold',
    },
    textInout: {
        height: 60,
        borderWidth: 1.2,
        borderColor: Colors.black,
        borderRadius: 13,
        backgroundColor: Colors.white,
        paddingRight: 40,
        paddingLeft: 20,
        fontSize: 20,
        color: Colors.black,
        fontWeight: '500',
    },
    signup: {
        marginTop: 80,
        alignSelf: 'center',
        backgroundColor: Colors.black,        
        paddingVertical: 17,
        width: width - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    signupPress: {
        backgroundColor: Colors.grayDark,
        transform: [{ scale: 0.99 }]
    },
    signupText: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    back: {
        position: 'absolute',
        left: 20,
        top: 30,
    },
    backPress: {
        transform: [{ scale: 0.97 }],
    },
    signinView: {
        flexDirection: 'row',
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        gap: 5,
    },
    signin: {
        backgroundColor: Colors.white,
        borderWidth: 0,
        elevation: 0,
        paddingHorizontal: 5,
    },
    signinPress: {
        transform: [{ scale: 0.97 }]
    },
    signinText: {
        fontSize: 19,
        fontWeight: '400',
        color: Colors.black,
    },
    signinPressText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.black,
    },
    passwordView: {
        justifyContent: 'center',
    },
    passwordPress: {
        position: 'absolute',
        right: 10,
    },
});