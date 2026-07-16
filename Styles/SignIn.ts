import { Dimensions, StyleSheet } from "react-native";

const Widthh = Dimensions.get("window").width;

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
        position: 'fixed' as any, // 'fixed' is not a valid React Native position type, adding 'as any' to avoid TS error if it was working
    },
    themeToggleBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
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
        color: colors.primary,
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
        fontWeight: '600',
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
        color: colors.primary,
    },
    signin: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 17,
        width: Widthh - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    signinPress: {
        backgroundColor: colors.grayDark,
        transform: [{ scale: 0.99 }]
    },
    signinText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    signupView: {
        flexDirection: 'row',
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        gap: 5,
    },
    signup: {
        backgroundColor: colors.white,
        borderWidth: 0,
        elevation: 0,
        paddingHorizontal: 5,
    },
    signupPress: {
        transform: [{ scale: 0.97 }]
    },
    signupText: {
        marginTop: 130,
        fontSize: 19,
        fontWeight: '400',
        color: colors.primary,
    },
    signupPressText: {
        marginTop: 130,
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
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