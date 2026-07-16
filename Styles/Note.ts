import { StyleSheet } from "react-native";

export default (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0d14ff',
        // backgroundColor: '#2b2b2bff',
        // backgroundColor: colors.primary,
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.white,
    },
    note: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.white,
    },
    header: {
        marginTop: 30,
        height: 100,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
    },
    body: {
        paddingHorizontal: 20,
        marginTop: 50,
    },
    bottomBar: {
        height: 100,
        borderTopWidth: 1,
        borderTopColor: colors.white,
        position: 'relative',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.primary,
    },
    iconText: {
        color: colors.white,
        fontSize: 20,
    },
    copy: {
        backgroundColor: colors.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.white,
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
        color: colors.white,
        fontSize: 16,
    },
});