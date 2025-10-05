import Colors from "@/assets/Colors";
import { Dimensions, StyleSheet } from "react-native";

const Widthh = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 5,
    },
    header: {
        backgroundColor: Colors.dark.primary,
        height: 200,
        alignItems: 'center',
        position: 'fixed',
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: Colors.dark.white,
        marginTop: 90,
    },
    body: {
        flex: 1,
        backgroundColor: Colors.dark.white,
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
        borderColor: Colors.dark.primary,
        borderRadius: 13,
        backgroundColor: Colors.dark.white,
        paddingRight: 40,
        paddingLeft: 20,
        fontSize: 20,
        color: Colors.dark.primary,
        fontWeight: '500',
    },
    forgotView: {
        width: '45%',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    forgotPress: {
        transform: [{ scale: 0.98 }],
    },
    forgotText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark.primary,
    },
    signin: {
        marginTop: 120,
        alignSelf: 'center',
        backgroundColor: Colors.dark.primary,
        paddingVertical: 17,
        width: Widthh - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    signinPress: {
        backgroundColor: Colors.dark.grayDark,
        transform: [{ scale: 0.99 }]
    },
    signinText: {
        color: Colors.dark.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    signupView: {
        flexDirection: 'row',
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.white,
        gap: 5,
    },
    signup: {
        backgroundColor: Colors.dark.white,
        borderWidth: 0,
        elevation: 0,
        paddingHorizontal: 5,
    },
    signupPress: {
        transform: [{ scale: 0.97 }]
    },
    signupText: {
        fontSize: 19,
        fontWeight: '400',
        color: Colors.dark.primary,
    },
    signupPressText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark.primary,
    },
    passwordView: {
        justifyContent: 'center',
        marginTop: 5,
    },
    passwordPress: {
        position: 'absolute',
        right: 10,
    },
    errorView: {
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
});