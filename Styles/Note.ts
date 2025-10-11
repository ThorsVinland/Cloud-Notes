import Colors from "@/assets/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0d14ff',
        // backgroundColor: '#2b2b2bff',
        // backgroundColor: Colors.dark.primary,
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.dark.white,
    },
    note: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.dark.white,
    },
    header: {
        marginTop: 30,
        height: 100,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: Colors.dark.white,
        borderBottomWidth: 1,
    },
    body: {
        paddingHorizontal: 20,
        marginTop: 50,
    },
    bottomBar: {
        height: 100,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.white,
        position: 'relative',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.dark.primary,
    },
    iconText: {
        color: Colors.dark.white,
        fontSize: 20,
    },
    copy: {
        backgroundColor: Colors.dark.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.dark.white,
        borderWidth: 1,
    },
    copyPress: {
        opacity: 0.6,
    },
    modalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    modalText: {
        color: Colors.dark.white,
        fontSize: 16,
    },
});