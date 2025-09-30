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
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.white,
        alignSelf: 'center',
        marginTop: 20,
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
        position :'absolute',
    },
    logoutPress: {
        transform: [{ scale: 0.96 }]
    },
    logoutText: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800',
    },
});