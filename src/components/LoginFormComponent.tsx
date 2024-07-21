import React from 'react';
import GoogleSVG from '../assets/icons/icons8-google.svg';
import FacebookSVG from '../assets/icons/icons8-facebook.svg';
import ButtonComponent from './ButtonComponent';
import TabLinkComponent from './TabLinkComponent';
import SpaceComponent from './SpaceComponent';
import styles from './LoginFormComponent.module.css';
import HorizontalRuleComponent from './HorizontalRuleComponent';
import { useAuth } from '../hooks/useAuth';
import InputComponent from './InputComponent';
import ErrorTextComponent from './ErrorTextComponent';

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
                <ButtonComponent
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
                            text="Đăng nhập"
                            onClick={() => {
                                setError('Email hoặc mật khẩu không đúng');
                            }}
                            type="submit"
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
