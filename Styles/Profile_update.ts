import { StyleSheet } from "react-native";

export default (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 28,
    },
    headView: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headViewText: {
        color: colors.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    InformationView: {
        backgroundColor: colors.grayDark,
        borderRadius: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        marginBottom: 22,
    },
    InformationViewText: {
        marginLeft: 14,
        flex: 1,
    },
    InformationViewName: {
        fontSize: 23,
        fontWeight: 'bold',
        color: colors.white,
    },
    InformationViewEmail: {
        fontSize: 15,
        fontWeight: '400',
        color: colors.textL,
        marginTop: 2,
    },
    sectionTitle: {
        color: colors.textL,
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 8,
    },
    sectionCard: {
        backgroundColor: colors.grayDark,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 10,
    },
    menuRow: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
    },
    menuRowPressed: {
        opacity: 0.75,
    },
    menuRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuRowTitle: {
        color: colors.white,
        fontSize: 17,
        fontWeight: '600',
    },
    menuRowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    menuRowValue: {
        color: colors.textL,
        fontSize: 15,
        fontWeight: '600',
    },
    imageView: {
        height: 72,
        width: 72,
        borderRadius: 36,
        backgroundColor: colors.primary,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});