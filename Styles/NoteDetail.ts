import { StyleSheet } from "react-native";

export default (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
    },
    textInputView: {
        marginTop: 100,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.white,
        marginTop: 30,
        borderRadius: 15,
        fontSize: 18,
        color: colors.white,
        paddingLeft: 20,
        paddingRight: 50,
    },
    btnView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        gap: 10,
    },
});