import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;

export default (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 5,
    },
    header: {
        backgroundColor: colors.primary,
        height: 200,
        alignItems: 'center',
        position: 'fixed',
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: colors.white,
        marginTop: 90,
    },
    body: {
        flex: 1,
        backgroundColor: colors.white,
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
        borderColor: colors.primary,
        borderRadius: 13,
        backgroundColor: colors.white,
        paddingRight: 40,
        paddingLeft: 20,
        fontSize: 20,
        color: colors.primary,
        fontWeight: '500',
    },
    signup: {
        marginTop: 80,
        alignSelf: 'center',
        backgroundColor: colors.primary,        
        paddingVertical: 17,
        width: width - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    signupPress: {
        backgroundColor: colors.grayDark,
        transform: [{ scale: 0.99 }]
    },
    signupText: {
        color: colors.white,
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
        backgroundColor: colors.white,
        gap: 5,
    },
    signin: {
        backgroundColor: colors.white,
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
        color: colors.primary,
    },
    signinPressText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
    },
    passwordView: {
        justifyContent: 'center',
    },
    passwordPress: {
        position: 'absolute',
        right: 10,
    },
});