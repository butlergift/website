/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Avatar, Button, Card, Container, Input, Loading, Modal, Text, Row, Spacer } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordFill } from 'react-icons/ri';
import { AiOutlineUser } from 'react-icons/ai';
import { FaBirthdayCake } from 'react-icons/fa';

import Colors from '../components/colors';
import { useAuth } from '../components/shared/auth/AuthContext';

const styles = {
  container: {
    padding: '20px',
  },
  inputText: {
    '--nextui--inputHoverBorderColor': Colors.primaryLight,
    '& span, label, input': {
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
    paddingTop: '0px',
    paddingBottom: '0px',
    '& label': {
      color: Colors.grayDark,
    },
    '& p': {
      color: Colors.grayDark,
    },
  },
  companyIcon: {
    width: '150px',
    height: '150px',
    marginBottom: '10px',
  },
  defaultUserPhoto: {
    color: Colors.grayDarkXX,
  },
  loginBtn: {
    background: Colors.primary,
    width: '100%',
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
    padding: '0px',
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

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();

  // Oldest 100 years (randomly chosen)
  const year = d.getUTCFullYear();
  const yearLowerLimit = (new Date()).getUTCFullYear() - 100;
  if (year <= yearLowerLimit) return false;

  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

const isValidEmail = (v) => v.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

function Login({ classes }) {
  const router = useRouter();
  const { user, login, logout, register, isUserLoading, signInWithGoogle, forgotPassword, updateUserProfile } = useAuth();
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordPostMessage, setForgotPasswordPostMessage] = useState('');
  const [inputEmailValue, setInputEmailValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [inputDisplayNameValue, setInputDisplayNameValue] = useState(user?.displayName || '');
  const [inputBirthdayValue, setInputBirthdayValue] = useState(user?.birthday || '');
  const [loginSignupView, setLoginSignupView] = useState('login');
  const [loginSignupErrorMsg, setloginSignupErrorMsg] = useState('');

  // Redirect on success login
  useEffect(() => {
    if (user && !!router?.query?.redirect) {
      router.push(router.query.redirect);
    }
    setInputDisplayNameValue(user?.displayName || '');
    setInputBirthdayValue(user?.birthday || '');
  }, [user]);

  const onForgotPasswordModalClose = () => {
    setForgotPasswordModalVisible(false);
    setloginSignupErrorMsg('');
    setTimeout(() => {
      setForgotPasswordPostMessage('');
      setInputEmailValue('');
      setInputPasswordValue('');
    }, 100);
  };

  function validateEmail(emailValue) {
    const isValid = isValidEmail(emailValue);
    if (!isValid) {
      setloginSignupErrorMsg('Invalid email');
      return false;
    }
    // Valid!
    setloginSignupErrorMsg('');
    return true;
  }

  function validatePassword(passwordValue) {
    if (loginSignupView === 'login') {
      setloginSignupErrorMsg('');
      return true;
    }
    const isValidMinLength = passwordValue.length >= 8;
    if (!isValidMinLength) {
      setloginSignupErrorMsg('Password should have minimum 8 characters');
      return false;
    }
    const isValidPassword = passwordRegex.test(passwordValue);
    if (!isValidPassword) {
      setloginSignupErrorMsg('Password should have minimum 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number and 1 special character');
      return false;
    }
    // Valid!
    setloginSignupErrorMsg('');
    return true;
  }

  function validateDisplayName(displayNameValue) {
    const cleanName = displayNameValue.replace(/[^a-z0-9\s\-_]/gi, '');
    if (!cleanName) {
      setloginSignupErrorMsg('Display name cannot be empty');
      setInputDisplayNameValue('');
      return false;
    }
    if (cleanName.length > 20) {
      setloginSignupErrorMsg('Invalid display name. Must be less than 20 characters.');
      return false;
    }
    // Valid!
    setloginSignupErrorMsg('');
    setInputDisplayNameValue(cleanName);
    return true;
  }

  function validateBirthday(birthdayValue) {
    if (birthdayValue.length > 0 && !isValidDate(inputBirthdayValue)) {
      setloginSignupErrorMsg('Invalid birthday date');
      return false;
    }
    // Valid!
    setloginSignupErrorMsg('');
    return true;
  }

  const onChangeInputEmail = (e) => {
    const { value } = e.target;
    setInputEmailValue(value);
    validateEmail(value);
  };

  const onChangeInputPassword = (e) => {
    const { value } = e.target;
    setInputPasswordValue(value);
    validatePassword(value);
  };

  const onChangeInputDisplayName = (e) => {
    const { value } = e.target;
    setInputDisplayNameValue(value);
    validateDisplayName(value);
  };

  const onChangeInputBirthday = (e) => {
    const { value } = e.target;
    setInputBirthdayValue(value);
    validateBirthday(value);
  };

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
      <Card variant="bordered" className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src={user.photoURL}
            className={classes.companyIcon}
            icon={<AiOutlineUser size={70} className={classes.defaultUserPhoto} />}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Text size={18} css={{ alignSelf: 'center' }}>
            Welcome&nbsp;
            {inputDisplayNameValue}
          </Text>
          <Spacer y={0.5} />
          <Input
            value={inputDisplayNameValue}
            onChange={onChangeInputDisplayName}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={() => setInputDisplayNameValue('')}
            type="text"
            label="DisplayName"
            placeholder="DisplayName"
            aria-label="DisplayName"
            contentLeft={<AiOutlineUser />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input
            value={inputBirthdayValue}
            onChange={onChangeInputBirthday}
            bordered
            fullWidth
            size="lg"
            shadow={false}
            aria-label="Birthday"
            label="Birthday"
            type="date"
            contentLeft={<FaBirthdayCake />}
            className={classes.inputText}
          />
          <Spacer y={1} />
          <Button
            className={classes.loginBtn}
            onPress={() => {
              const isDisplayNameValid = validateDisplayName(inputDisplayNameValue);
              const isBirthdayValid = validateBirthday(inputBirthdayValue);
              if (!isDisplayNameValid || !isBirthdayValid) {
                return;
              }
              updateUserProfile({
                ...(isDisplayNameValid && inputDisplayNameValue !== user?.displayName && { displayName: inputDisplayNameValue }),
                ...(isBirthdayValid && inputBirthdayValue !== user?.birthday && { birthday: inputBirthdayValue }),
              })
                .catch(() => {
                  setloginSignupErrorMsg('An error has occurred, please try again later');
                });
            }}
          >
            Update Profile
          </Button>
          {
            loginSignupErrorMsg && (
              <Row justify="center">
                <Text b size={14} css={{ color: Colors.red }}>{loginSignupErrorMsg}</Text>
              </Row>
            )
          }
        </Card.Body>
        <Spacer y={1} />
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
      <Card variant="bordered" className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/butlergift-dev-fdebd.appspot.com/o/images%2Fcompany_icon_1024.png?alt=media&token=7368407e-477b-4e70-a3de-6373af4071ad"
            className={classes.companyIcon}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Input
            value={inputEmailValue}
            onChange={onChangeInputEmail}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={() => setInputEmailValue('')}
            type="email"
            label="Email"
            placeholder="Email"
            aria-label="Email"
            contentLeft={<HiOutlineMail />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input.Password
            value={inputPasswordValue}
            onChange={onChangeInputPassword}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={() => setInputPasswordValue('')}
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
              width="90%"
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
                      value={inputEmailValue}
                      onChange={onChangeInputEmail}
                      clearable
                      bordered
                      fullWidth
                      size="lg"
                      shadow={false}
                      onClearClick={() => setInputEmailValue('')}
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
                        if (!validateEmail(inputEmailValue)) {
                          return;
                        }
                        const message = 'Reset email sent.\nMake sure to check your spam folder!';
                        forgotPassword(inputEmailValue)
                          .then(() => setForgotPasswordPostMessage(message))
                          .catch(() => setForgotPasswordPostMessage(message));
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
              className={classes.loginBtn}
              onPress={() => {
                if (!validateEmail(inputEmailValue) || !validatePassword(inputPasswordValue)) {
                  return;
                }
                if (inputEmailValue.split('@')[1] === 'gmail.com') {
                  signInWithGoogle();
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
              }}
            >
              Login
            </Button>
          </Row>
          {
            loginSignupErrorMsg && (
              <Row justify="center">
                <Text b size={14} css={{ color: Colors.red }}>{loginSignupErrorMsg}</Text>
              </Row>
            )
          }
        </Card.Body>
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
      <Card variant="bordered" className={classes.cardContainer}>
        <Card.Header className={classes.cardHeader}>
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/butlergift-dev-fdebd.appspot.com/o/images%2Fcompany_icon_1024.png?alt=media&token=7368407e-477b-4e70-a3de-6373af4071ad"
            className={classes.companyIcon}
          />
        </Card.Header>
        <Card.Body className={classes.cardBody}>
          <Input
            value={inputEmailValue}
            onChange={onChangeInputEmail}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={() => setInputEmailValue('')}
            type="email"
            label="Email"
            placeholder="Email"
            aria-label="Email"
            contentLeft={<HiOutlineMail />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input.Password
            value={inputPasswordValue}
            onChange={onChangeInputPassword}
            clearable
            bordered
            fullWidth
            size="lg"
            shadow={false}
            onClearClick={() => setInputPasswordValue('')}
            label="Password"
            placeholder="Password"
            aria-label="Password"
            contentLeft={<RiLockPasswordFill />}
            className={classes.inputText}
          />
          <Spacer y={0.5} />
          <Input
            value={inputBirthdayValue}
            onChange={onChangeInputBirthday}
            bordered
            fullWidth
            size="lg"
            shadow={false}
            aria-label="Birthday"
            label="Birthday"
            type="date"
            contentLeft={<FaBirthdayCake />}
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
              className={classes.loginBtn}
              onPress={() => {
                if (!validateEmail(inputEmailValue) || !validatePassword(inputPasswordValue) || !validateBirthday(inputBirthdayValue)) {
                  return;
                }
                if (inputEmailValue.split('@')[1] === 'gmail.com') {
                  signInWithGoogle();
                  return;
                }
                register(inputEmailValue, inputPasswordValue, inputBirthdayValue)
                  .catch((e) => {
                    if (e.message.indexOf('auth/email-already-in-use') > -1) {
                      setloginSignupErrorMsg('Email already in use');
                      return;
                    }
                    setloginSignupErrorMsg('An error has occurred, please try again later');
                  });
              }}
            >
              Sign up
            </Button>
          </Row>
          {
            loginSignupErrorMsg && (
              <Row justify="center">
                <Text b size={14} css={{ color: Colors.red }}>{loginSignupErrorMsg}</Text>
              </Row>
            )
          }
        </Card.Body>
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
    <div className={classes.container}>
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
      >
        {content}
      </Container>
    </div>
  );
}

Login.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(Login);
