import Colors from "@/assets/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary,
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
        fontSize: 25,
        fontWeight: '600',
        color: Colors.dark.white,
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
});