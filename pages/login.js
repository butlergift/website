/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Avatar, Button, Card, Container, Input, Loading, Modal, Text, Row, Spacer, useInput } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordFill } from 'react-icons/ri';

import Colors from '../components/colors';
import { useAuth } from '../components/shared/auth/AuthContext';

const styles = {
  container: {
    marginTop: '20px',
  },
  inputText: {
    '--nextui--inputHoverBorderColor': Colors.primaryLight,
    '& span, label': {
      color: Colors.grayDark,
    },
    '& button span': {
      color: Colors.grayMediumX,
    },
  },
  cardHeader: {
    justifyContent: 'center',
    padding: '0px',
  },
  cardContainer: {
    padding: '20px',
  },
  cardBody: {
    '& label': {
      color: Colors.grayDark,
    },
  },
  companyIcon: {
    width: '150px',
    height: '150px',
  },
  loginAlternativeBtn: {
    width: '100%',
    background: Colors.white,
    color: Colors.black,
    border: `1px solid ${Colors.grayMediumX}`,
  },
  forgotPassword: {
    background: 'transparent',
    color: Colors.grayDark,
  },
  modalContainer: {
    color: Colors.grayDark,
    fontWeight: '600',
  },
  modalPasswordClose: {
    background: Colors.grayMedium,
    color: Colors.grayDark,
  },
  modalPasswordSend: {
    background: Colors.primary,
    color: Colors.white,
  },
};

const Login = ({ classes }) => {
  const router = useRouter();
  const [loginSignupView, setLoginSignupView] = useState('login');
  const [loginSignupErrorMsg, setloginSignupErrorMsg] = useState('');
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordPostMessage, setForgotPasswordPostMessage] = useState('');
  const { user, login, logout, register, isUserLoading, signInWithGoogle, forgotPassword } = useAuth();
  const { value: inputEmailValue, reset: inputEmailReset, bindings: inputEmailBindings } = useInput('');
  const { value: inputPasswordValue, reset: inputPasswordReset, bindings: inputPasswordBindings } = useInput('');

  // Redirect on success login
  useEffect(() => {
    if (user) {
      router.push(router?.query?.redirect || '/');
    }
  }, [user]);

  const onForgotPasswordModalClose = () => {
    setForgotPasswordModalVisible(false);
    setloginSignupErrorMsg();
    setTimeout(() => {
      setForgotPasswordPostMessage('');
      inputEmailReset();
      inputPasswordReset();
    }, 100);
  };

  const isValidEmail = (v) => v.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const inputValidateEmail = useMemo(() => {
    if (!inputEmailValue) {
      return { text: '', color: '' };
    }
    const isValid = isValidEmail(inputEmailValue);
    if (!isValid) {
      setloginSignupErrorMsg('Invalid email');
    } else {
      setloginSignupErrorMsg('');
    }
    return {
      text: isValid ? 'Valid email' : 'Invalid email',
      color: isValid ? '' : 'error',
    };
  }, [inputEmailValue]);

  let content = null;
  if (isUserLoading) {
    content = (
      <Loading
        css={{
          display: 'flex',
          justifyContent: 'center',
          margin: '50px',
        }}
        loadingCss={{
          $$loadingSize: '40px',
          $$loadingBorder: '2px',
          $$loadingColor: Colors.primary,
        }}
      />
    );
  } else if (user) {
    content = (
      <Card className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src={user.photoURL}
            className={classes.companyIcon}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Row justify="center">
            <Text size={18}>
              Welcome&nbsp;
              {user.displayName || ''}
            </Text>
          </Row>
        </Card.Body>
        <Card.Divider css={{ alignSelf: 'center', width: '75%' }} />
        <Spacer y={0.5} />
        <Card.Footer>
          <Row justify="center">
            <Button className={classes.loginAlternativeBtn} onPress={logout}>
              Logout
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    );
  } else if (loginSignupView === 'login') {
    content = (
      <Card className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/butlergift-dev-fdebd.appspot.com/o/images%2Fcompany_icon_1024.png?alt=media&token=7368407e-477b-4e70-a3de-6373af4071ad"
            className={classes.companyIcon}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Input
            {...inputEmailBindings}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={inputEmailReset}
            status={inputValidateEmail.color}
            color={inputValidateEmail.color}
            helperColor={inputValidateEmail.color}
            type="email"
            label="Email"
            placeholder="Email"
            aria-label="Email"
            contentLeft={<HiOutlineMail />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input.Password
            {...inputPasswordBindings}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={inputPasswordReset}
            label="Password"
            placeholder="Password"
            aria-label="Password"
            contentLeft={<RiLockPasswordFill />}
            className={classes.inputText}
          />
          <Spacer y={0.2} />
          <Row justify="space-between">
            <Button size="xs" className={classes.forgotPassword} animated={false} onPress={() => setLoginSignupView('signup')}>
              New? Sign up!
            </Button>
            <Button size="xs" className={classes.forgotPassword} animated={false} onPress={() => setForgotPasswordModalVisible(true)}>
              Forgot password
            </Button>
            <Modal
              closeButton
              aria-labelledby="modal-title"
              open={forgotPasswordModalVisible}
              onClose={onForgotPasswordModalClose}
            >
              <Modal.Header>
                <Text size={18} className={classes.modalContainer}>
                  Reset Password
                </Text>
              </Modal.Header>
              <Modal.Body className={classes.cardBody}>
                {
                  forgotPasswordPostMessage.length === 0 ? (
                    <Input
                      {...inputEmailBindings}
                      clearable
                      bordered
                      fullWidth
                      size="lg"
                      shadow={false}
                      onClearClick={inputEmailReset}
                      status={inputValidateEmail.color}
                      color={inputValidateEmail.color}
                      helperColor={inputValidateEmail.color}
                      helperText={inputValidateEmail.text}
                      type="email"
                      label="Email"
                      placeholder="Email"
                      aria-label="Email"
                      contentLeft={<HiOutlineMail />}
                      className={classes.inputText}
                    />
                  ) : (
                    forgotPasswordPostMessage.split('\n').map((s) => <Text key={s} css={{ padding: 0, margin: 0 }}>{s}</Text>)
                  )
                }
                <Spacer y={0.05} />
              </Modal.Body>
              <Modal.Footer>
                <Button auto className={classes.modalPasswordClose} onPress={onForgotPasswordModalClose}>
                  Close
                </Button>
                {
                  forgotPasswordPostMessage.length === 0 && (
                    <Button
                      auto
                      className={classes.modalPasswordSend}
                      onPress={() => {
                        if (isValidEmail(inputEmailValue)) {
                          const message = 'Reset email sent.\nMake sure to check your spam folder!';
                          forgotPassword(inputEmailValue)
                            .then(() => setForgotPasswordPostMessage(message))
                            .catch(() => setForgotPasswordPostMessage(message));
                        }
                      }}
                    >
                      Send Link
                    </Button>
                  )
                }
              </Modal.Footer>
            </Modal>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Button
              css={{ width: '100%', background: Colors.primary }}
              onPress={() => {
                if (isValidEmail(inputEmailValue)) {
                  if (inputEmailValue.split('@')[1] === 'gmail.com') {
                    signInWithGoogle();
                    return;
                  }
                  if (inputPasswordValue.length === 0) {
                    setloginSignupErrorMsg('Password is required');
                    return;
                  }
                  login(inputEmailValue, inputPasswordValue)
                    .catch((e) => {
                      if (e.message.indexOf('auth/user-not-found') > -1) {
                        setloginSignupErrorMsg('User not found');
                        return;
                      }
                      if (e.message.indexOf('auth/wrong-password') > -1) {
                        setloginSignupErrorMsg('Incorrect Password');
                        return;
                      }
                      if (e.message.indexOf('auth/too-many-requests') > -1) {
                        setloginSignupErrorMsg('Too many attempts. You can reset password or try again later.');
                        return;
                      }
                      setloginSignupErrorMsg('An error has occurred, please try again later');
                    });
                }
              }}
            >
              Login
            </Button>
          </Row>
          <Row justify="center">
            {
              loginSignupErrorMsg && <Text size={14} css={{ color: Colors.red }}>{loginSignupErrorMsg}</Text>
            }
          </Row>
        </Card.Body>
        <Card.Divider css={{ alignSelf: 'center', width: '75%' }} />
        <Spacer y={0.5} />
        <Card.Footer>
          <Row justify="center">
            <Button className={classes.loginAlternativeBtn} onPress={signInWithGoogle}>
              <FcGoogle />
              &nbsp;Login with Google
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    );
  } else {
    // Sign Up View
    content = (
      <Card className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/butlergift-dev-fdebd.appspot.com/o/images%2Fcompany_icon_1024.png?alt=media&token=7368407e-477b-4e70-a3de-6373af4071ad"
            className={classes.companyIcon}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Input
            {...inputEmailBindings}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={inputEmailReset}
            status={inputValidateEmail.color}
            color={inputValidateEmail.color}
            helperColor={inputValidateEmail.color}
            type="email"
            label="Email"
            placeholder="Email"
            aria-label="Email"
            contentLeft={<HiOutlineMail />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input.Password
            {...inputPasswordBindings}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={inputPasswordReset}
            label="Password"
            placeholder="Password"
            aria-label="Password"
            contentLeft={<RiLockPasswordFill />}
            className={classes.inputText}
          />
          <Spacer y={0.2} />
          <Row justify="left">
            <Button size="xs" className={classes.forgotPassword} animated={false} onPress={() => setLoginSignupView('login')}>
              Already have an account? Login!
            </Button>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Button
              css={{ width: '100%', background: Colors.primary }}
              onPress={() => {
                if (isValidEmail(inputEmailValue)) {
                  if (inputEmailValue.split('@')[1] === 'gmail.com') {
                    signInWithGoogle();
                    return;
                  }
                  if (inputPasswordValue.length === 0) {
                    setloginSignupErrorMsg('Password is required');
                    return;
                  }
                  register(inputEmailValue, inputPasswordValue)
                    .catch((e) => {
                      if (e.message.indexOf('auth/email-already-in-use') > -1) {
                        setloginSignupErrorMsg('Email already in use');
                        return;
                      }
                      setloginSignupErrorMsg('An error has occurred, please try again later');
                    });
                }
              }}
            >
              Sign up
            </Button>
          </Row>
          <Row justify="center">
            {
              loginSignupErrorMsg && <Text size={14} css={{ color: Colors.red }}>{loginSignupErrorMsg}</Text>
            }
          </Row>
        </Card.Body>
        <Card.Divider css={{ alignSelf: 'center', width: '75%' }} />
        <Spacer y={0.5} />
        <Card.Footer>
          <Row justify="center">
            <Button className={classes.loginAlternativeBtn} onPress={signInWithGoogle}>
              <FcGoogle />
              &nbsp;Sign up with Google
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    );
  }

  return (
    <>
      <Head>
        <title>Butler Gift | Login</title>
        <meta name="keywords" content="gifts" />
      </Head>
      <Container
        fluid
        xs
        display="flex"
        direction="column"
        alignContent="center"
        alignItems="center"
        className={classes.container}
      >
        {content}
      </Container>
    </>
  );
};

Login.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(Login);
