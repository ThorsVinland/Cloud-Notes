import Colors from "@/assets/Colors";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: Platform.OS === "android" ?
            (StatusBar.currentHeight ?? 0) + 10
            : 0
        ,
        paddingHorizontal: 10,
    },
    headerText: {
        color: Colors.dark.text,
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.dark.white,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profilePress: {
        transform: [{ scale: 0.95 }]
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addView: {
        backgroundColor: '#1a212f',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    addPress: {
        transform: [{ scale: 0.95 }]
    },
    addIcon: {
        height: 50,
        width: 50,
        resizeMode: 'cover',
    },
    noteItem: {
        backgroundColor: Colors.dark.grayDark,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    noteItemPress: {
        opacity: 0.7,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 5,
    },
    noteText: {
        fontSize: 14,
        color: Colors.dark.textL,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteView: {
        justifyContent: 'center',
        marginTop: 40,
    },
    noteViewText: {
        textAlign: 'center',
        color: Colors.dark.white,
        fontSize: 25,
        fontWeight: '600',
    },
});