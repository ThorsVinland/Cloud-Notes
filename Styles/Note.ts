import Colors from "@/assets/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.white,
    },
    note: {
        fontSize: 25,
        fontWeight: '600',
        color: Colors.white,
    },
    header: {
        height: 140,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    body: {
        padding: 20,
    },
    bottomBar: {
        height: 100,
        borderTopWidth: 1,
        borderTopColor: Colors.white,
        position: 'relative',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.black,
    },
    iconText: {
        color: Colors.white,
        fontSize: 20,
    },
    copy: {
        backgroundColor: Colors.black,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.white,
        borderWidth: 1,
    },
    copyPress: {
        opacity: 0.6,
    },
});