import React from 'react';
import GoogleSVG from '../assets/icons/icons8-google.svg';
import FacebookSVG from '../assets/icons/icons8-facebook.svg';
import TabLinkComponent from './TabLinkComponent';
import styles from './LoginFormComponent.module.css';
import { useAuth } from '../hooks/useAuth';
import SpaceComponent from './comonComponent/SpaceComponent';
import ButtonComponent from './comonComponent/ButtonComponent';
import HorizontalRuleComponent from './comonComponent/HorizontalRuleComponent';
import InputComponent from './comonComponent/InputComponent';
import ErrorTextComponent from './comonComponent/ErrorTextComponent';

function LoginFormComponent() {
    const { signInWithGoogle, signInWithFacebook } = useAuth();

    const [isLogin, setIsLogin] = React.useState(true);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [error, setError] = React.useState('');

    const handleSwitchTab = (isLogin: boolean) => {
        setIsLogin(isLogin);
    };
    return (
        <div className={styles['container']}>
            <div className={styles['sub-container']}>
                <div className={styles['tab-link-container']}>
                    <TabLinkComponent
                        text="Đăng nhập"
                        active={isLogin}
                        onClick={() => {
                            if (isLogin) return;
                            handleSwitchTab(true);
                        }}
                    />
                    <SpaceComponent width={16} />
                    <TabLinkComponent
                        text="Đăng ký"
                        active={!isLogin}
                        onClick={() => {
                            if (!isLogin) return;
                            handleSwitchTab(false);
                        }}
                    />
                </div>
                <SpaceComponent height={32} />
                <ButtonComponent
                    borderColor="var(--border-color)"
                    backgroundHoverColor="var(--bg-hover-color)"
                    backgroundActiveColor="var(--border-color)"
                    icon={
                        <img
                            style={{
                                width: 24,
                                height: 24
                            }}
                            src={GoogleSVG}
                        />
                    }
                    text="Đăng nhập bằng Google"
                    onClick={signInWithGoogle}
                />
                <SpaceComponent height={16} />
                <ButtonComponent
                    borderColor="var(--border-color)"
                    backgroundHoverColor="var(--bg-hover-color)"
                    backgroundActiveColor="var(--border-color)"
                    icon={
                        <img
                            style={{
                                width: 24,
                                height: 24
                            }}
                            src={FacebookSVG}
                        />
                    }
                    text="Đăng nhập bằng Facebook"
                    onClick={signInWithFacebook}
                />

                <HorizontalRuleComponent text="or email" />

                {isLogin ? (
                    <>
                        <InputComponent
                            label="Email"
                            propStyles={{
                                marginBottom: 24
                            }}
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                        />
                        <InputComponent
                            label="Password"
                            type="password"
                            propStyles={{
                                marginBottom: 24
                            }}
                            placeholder="Nhập mật khẩu của bạn"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            value={password}
                        />

                        <ErrorTextComponent text={error} />
                        <SpaceComponent height={8} />

                        <ButtonComponent
                            backgroundColor="var(--primary-color)"
                            backgroundHoverColor="var(--primary-hover-color)"
                            backgroundActiveColor="var(--primary-active-color)"
                            textColor="var(--white-color)"
                            text="Đăng nhập"
                            onClick={() => {
                                setError('Email hoặc mật khẩu không đúng');
                            }}
                        />
                    </>
                ) : (
                    <h1>heelo</h1>
                )}
            </div>
        </div>
    );
}

export default LoginFormComponent;
