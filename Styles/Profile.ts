import { StyleSheet } from "react-native";

export default (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: 'center',
        paddingVertical: 80,
    },
    card: {
        backgroundColor: colors.grayDark,
        borderRadius: 10,
        marginVertical: 10,
        padding: 15,
    },
    cardContent: {
        flexDirection: 'column',
        gap: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        flex: 1,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    imageView: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    logoutView: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
    },
    logoutPress: {
        transform: [{ scale: 0.96 }],
    },
    logoutText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '800',
    },
    modalContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
    },
    ModalTextInput: {
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 10,
        height: 60,
        fontSize: 20,
        color: colors.white,
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
        backgroundColor: colors.grayLight,
        width: 120,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    ModalSavePressText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '700',
    },
});