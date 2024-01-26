import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Header } from '@components/header'
import { SizedBox } from '@components/sized-box'
import { ImageComponent } from '@components/image-component'
import { Search, arrowLeft, loginLogo, onelogo } from '@assets/images'
import { normalScale, verticalScale } from '@theme/device/normalize'
import { Input } from '@components/input'
import { TouchableOpacity } from 'react-native'
import { ButtonComponent } from '@components/button-component'
import { useStringsAndLabels } from '@app-hooks/use-strings-and-labels'
import Toast from 'react-native-simple-toast';
import { emailRegexEx } from '@assets/constants'
import { navigations } from '@config/app-navigation/constant'
import { NavigationContainerRef, ParamListBase } from '@react-navigation/native'
import { useToken } from '@app-hooks/use-token'
import { useCreateStripeCustomer } from '@network/hooks/payment-service-hooks/use-create-stripe-customer';
import { useSaveCustomerId } from '@network/hooks/user-service-hooks/use-save-customer-id';
import { useDispatch } from 'react-redux';
import { onSetUser } from '@network/reducers/user-profile-reducer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader } from '@components/loader'
import { useLogin } from '@network/hooks/user-service-hooks/use-login'

interface SignUpProps {
    navigation: NavigationContainerRef<ParamListBase>;
}

export const SignUp = (props: SignUpProps) => {
    const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phoneNo: '', password: '', confirmPass: '' });
    const [isChecked, setIsChecked] = useState(false);
    const { strings } = useStringsAndLabels();
    const { navigation } = props || {};
    const { onSetToken } = useToken();
    const handleUserData = (value: string, key: string) => {
        setUser({ ...user, [key]: value });
    };
    const [isLoading, LodingData] = useState(false);
    const { mutateAsync: createStripeCustomer } = useCreateStripeCustomer();
    const { mutateAsync: saveCustomerId } = useSaveCustomerId();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');


    async function onSignUpAPI() {
        LodingData(true)
        const userData: any = {
            "first_name": user.firstName,
            "last_name": user.lastName,
            "email": user.email,
            // "mobile_number": '',
            "password": user.password,
            "cpassword": user.confirmPass
        }
        console.log(userData)
        try {
            const response = await fetch('https://app.onelocal.one/api/v1/auth/signup', {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: Object.keys(userData)
                    .map(key => key + '=' + userData[key])
                    .join('&'),
            });
            const signData = await response.json();
            console.log('===========Sign UP API==============')
            console.log(signData);
            const res = await signData;
            LodingData(false)
            Toast.show(signData.message, Toast.LONG, {
                backgroundColor: 'black',
            });
            const { success, data } = res || {};
            if (success) {
                const {
                    first_name,
                    last_name,
                    mobile_number,
                    customer_id,
                    access_token,
                    id,
                } = data || {};

                await onSetToken(access_token);

                if (!customer_id) {
                    const stripeRes = await createStripeCustomer({
                        bodyParams: {
                            name: `${first_name} ${last_name}`,
                            phone: mobile_number,
                            description: 'Test',
                        },
                    });
                    let stripeCustomerId = '';
                    if (stripeRes?.statusCode === 200) {
                        stripeCustomerId = stripeRes?.data?.id;
                    }
                    dispatch(onSetUser({ ...data, stripeCustomerId }));

                    await saveCustomerId({
                        bodyParams: { userId: id, customerId: stripeCustomerId },
                    });
                } else {
                    dispatch(onSetUser({ ...data, stripeCustomerId: customer_id }));
                }

                navigation.reset({
                    index: 0,
                    routes: [{ name: navigations.BOTTOM_NAVIGATION }],
                });

                // navigation.reset({
                //     index: 0,
                //     routes: [{ name: navigations.BOTTOM_NAVIGATION }],
                // });
            }
        } catch (error) {

            console.error(error);
        }
    }

    const onCheckValidation = () => {
        if (user.firstName.length === 0) {
            Toast.show('Enter your First Name', Toast.LONG, {
                backgroundColor: 'black',
            });
        } else if (user.lastName.length === 0) {
            Toast.show('Enter your Last Name', Toast.LONG, {
                backgroundColor: 'black',
            });
        } else if (!emailRegexEx.test(String(user.email).toLowerCase())) {
            Toast.show('Enter your Valid Email', Toast.LONG, {
                backgroundColor: 'black',
            });
        }
        // else if (user.phoneNo.length < 10) {
        //     Toast.show('Enter Valid Phone Number', Toast.LONG, {
        //         backgroundColor: 'black',
        //     });
        // } 
        else if (user.password.length < 8) {
            Toast.show('Password Must be 8 Digit', Toast.LONG, {
                backgroundColor: 'black',
            });
        } else if (user.password !== user.confirmPass) {
            Toast.show('Password and Confirm Should be Same', Toast.LONG, {
                backgroundColor: 'black',
            });
        } else {
            onSignUpAPI();
        }
    };

    const onBackPress = () => {
        navigation.goBack();
    };

    const keyboardDismiss = () => {
        Keyboard.dismiss()
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={keyboardDismiss}>
            <Loader visible={isLoading} showOverlay />

            <TouchableOpacity style={styles.HeaderContainerTwo} activeOpacity={1}>
                <TouchableOpacity onPress={onBackPress} style={{ zIndex: 11111222222 }}>
                    <View style={styles.row2}>
                        <ImageComponent source={arrowLeft} style={styles.arrowLeft} />
                    </View>
                </TouchableOpacity>
                {/* <View style={styles.searchContainer}>
                    <ImageComponent style={styles.searchIcon} source={Search}></ImageComponent>
                    <TextInput value={searchQuery} placeholderTextColor="#FFFF" placeholder='Search' style={styles.searchInput} onChangeText={value => {
                        console.log(value)
                        setSearchQuery(value)
                    }}></TextInput>
                </View> */}

                <View style={styles.oneContainer}>
                    <ImageComponent style={styles.oneContainerImage} source={onelogo}></ImageComponent>
                    <Text style={styles.oneContainerText}>NE</Text>
                </View>

            </TouchableOpacity>

            <SizedBox height={verticalScale(22)} />
            <ImageComponent source={loginLogo} style={styles.loginLogo} />
            <SizedBox height={verticalScale(22)} />
            <View style={styles.container}>
                <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.firstName}
                    value={user.firstName}
                    onChangeText={text => handleUserData(text, 'firstName')}
                />
                <SizedBox height={verticalScale(14)} />
                <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.lastName}
                    value={user.lastName}
                    onChangeText={text => handleUserData(text, 'lastName')}
                />
                <SizedBox height={verticalScale(14)} />
                <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.email}
                    value={user.email}
                    onChangeText={text => handleUserData(text, 'email')}
                />
                <SizedBox height={verticalScale(14)} />
                {/* <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.phoneNo}
                    value={user.phoneNo}
                    onChangeText={text => handleUserData(text, 'phoneNo')}
                />
                <SizedBox height={verticalScale(14)} /> */}
                <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.password}
                    secureTextEntry
                    value={user.password}
                    onChangeText={text => handleUserData(text, 'password')}
                />
                <SizedBox height={verticalScale(14)} />
                <TextInput
                    placeholderTextColor='#333333'
                    style={styles.textInput}
                    placeholder={strings.confirmPass}
                    secureTextEntry
                    value={user.confirmPass}
                    onChangeText={text => handleUserData(text, 'confirmPass')}
                />
                <SizedBox height={verticalScale(14)} />
                <ButtonComponent
                    style={styles.signUpBtn}
                    // onPress={onSignUp}
                    onPress={onCheckValidation}
                    title={strings.signUpTwo}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loginLogo: {
        height: normalScale(85),
        width: normalScale(85),
        alignSelf: 'center',
    },
    container: {
        paddingHorizontal: normalScale(50),
    },
    tncStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radio: {
        height: normalScale(18),
        width: normalScale(18),
        marginRight: normalScale(15),
    },
    agreeText: {
        fontSize: 14,
        fontFamily: 'NotoSerif-Regular',
        color: 'black',
    },
    bold: {
        fontFamily: 'bold',
    },
    forgot: {
        fontSize: 14,
        fontFamily: 'NotoSerif-Regular',
        color: 'black',
        alignSelf: 'center',
    },
    googleButton: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: normalScale(14),
        paddingVertical: verticalScale(15),
        alignItems: 'center',
        flexDirection: 'row',
    },
    google: {
        height: normalScale(24),
        width: normalScale(24),
    },
    loginGoogle: {
        fontSize: 14,
        fontFamily: 'NotoSerif-Regular',
        color: 'black',
        marginLeft: normalScale(18),
    },
    signUpBtn: {
        backgroundColor: '#684F85',
        borderRadius: 14,
        paddingVertical: verticalScale(14),
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: verticalScale(0),
        },
        elevation: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalScale(16),
        marginTop: 15
    },
    textInput: {
        backgroundColor: '#D1D1D1',
        borderRadius: 8,
        fontSize: 14,
        borderColor: '#535353',
        borderWidth: 1,
        padding: normalScale(10),
        fontFamily: 'NotoSerif-Regular',
        height: verticalScale(46),
        color: 'black'
    },
    HeaderContainerTwo: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#6E1111',
        height: 160,
        // position: 'relative',
    },
    row2: {
        position: 'absolute',
        top: 52,
        left: 10,
        height: normalScale(30),
        width: normalScale(30), 
        zIndex:11111222222,
        paddingLeft:4,
        paddingTop:4
    },
    arrowLeft: {
        height: normalScale(22),
        width: normalScale(22),
    },
    searchContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: 35,
        width: 100,
        borderRadius: 10,
        flexDirection: 'row',
        marginLeft: 8,
        position: 'absolute',
        bottom: 20,
        color: '#FFFFFF'
    },
    searchInput: {
        flexShrink: 1,
        marginLeft: 7,
        marginRight: 5,
        height: 35,
        width: 120,
        color: '#FFFFFF'
    },
    searchIcon: {
        height: 15,
        width: 15,
        marginTop: 10,
        marginLeft: 5
    },
    oneContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        top: 50,
    },
    oneContainerImage: {
        height: 60,
        width: 60,
        marginTop: 10,
        marginLeft: 5
    },
    oneContainerText: {
        textAlign: 'center',
        fontSize: 60,
        fontFamily: 'NotoSerif-Regular',
        fontWeight: '400',
        color: '#FFFFFF',
        marginLeft: 2,
    },
})