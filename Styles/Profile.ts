import Colors from "@/assets/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingHorizontal: 20,
    },
    imageView: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginTop: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    nameView: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.white,
        marginHorizontal: 45,
    },
    editName: {
        position: 'absolute',
        right: 15,
    },
    editNamePress: {
        opacity: 0.6,
    },
    logoutView: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        bottom: 60,
        left: 20,
        position: 'absolute',
    },
    logoutPress: {
        transform: [{ scale: 0.96 }]
    },
    logoutText: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800',
    },
    modalContainer: {
        flex: 1,
        // justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
    },
    ModalNameView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center'
    },
    ModalTextInput: {
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 10,
        height: 60,
        fontSize: 20,
        color: Colors.white,
        paddingLeft: 18,
        paddingRight: 40,
    },
    ModalDeleteTextPress: {
        position: 'absolute',
        right: 15,
    },
    ModalSaveView: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
    },
    ModalSavePress: {
        backgroundColor: Colors.grayLight,
        width: 120,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    ModalSavePressText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: '700',
    },
});