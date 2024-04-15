import { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  RHeading,
  RStack,
  RButton,
  RText,
  RIconButton,
  InputText,
  InputTextRules,
  RScrollView,
  Form,
  FormInput,
  SubmitButton,
} from '@packrat/ui';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'app/hooks/router';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from '@packrat/crosspath';
import useTheme from '../hooks/useTheme';
import { useForm } from 'react-hook-form';
import { useSession } from '../context/Auth/SessionProvider';
import { useRegisterUser, useGoogleAuth } from 'app/auth/hooks';
import { userSignUp } from '@packrat/validations';

export default function Register() {
  const { currentTheme } = useTheme();
  const { registerUser } = useRegisterUser();
  const { promptAsync } = useGoogleAuth();

  return (
    <RScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            paddingTop: 32,
            paddingBottom: 32,
            width: '90%',
            maxWidth: 290,
          }}
        >
          <RHeading fontSize={32} color="#212121" fontWeight="semibold">
            Welcome
          </RHeading>
          <RHeading
            color="grey"
            fontWeight="medium"
            fontSize={14}
            style={{ marginTop: 8 }}
          >
            Sign up to continue!
          </RHeading>
          <Form validationSchema={userSignUp}>
            <RStack style={{ marginTop: 16, gap: 8 }}>
              <FormInput label="Name" name="name" />

              <FormInput
                label="Email ID"
                keyboardType="email-address"
                name="email"
              />

              <FormInput label="Username" name="username" />

              <FormInput label="Password" secureTextEntry name="password" />

              <SubmitButton
                onSubmit={registerUser}
                style={{ marginTop: 16, backgroundColor: 'mediumpurple' }}
              >
                {'Sign up'}
              </SubmitButton>
              <RStack
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <RText fontSize={14} color="grey">
                  Already a User?
                </RText>
                <Link href="/sign-in">
                  <RText
                    style={{
                      color: '#818cf8',
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    Login Here
                  </RText>
                </Link>
              </RStack>
              {/* Google register */}
              <RStack
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <RText color="grey" fontWeight="medium" fontSize={14}>
                  Or
                </RText>
              </RStack>
              {/* Google register */}
              <RStack
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <RIconButton
                  onPress={async () => await promptAsync()}
                  backgroundColor="red"
                  style={{ width: '100%', color: 'white' }}
                  icon={
                    <FontAwesome
                      name="google"
                      size={16}
                      color={currentTheme.colors.white}
                    />
                  }
                >
                  Sign up with Google
                </RIconButton>
              </RStack>
              {/* Google register */}
            </RStack>
          </Form>
        </View>
      </View>
    </RScrollView>
  );
}
