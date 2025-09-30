import { StyleSheet } from "react-native";
import Colors from "@/assets/Colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingHorizontal: 20,
    },
    textInputView: {
        marginTop: 100,
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.white,
        marginTop: 30,
        borderRadius: 15,
        fontSize: 18,
        color: Colors.white,
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