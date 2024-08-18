import { useState } from 'react';
import FacebookSVG from '../../assets/icons/icons8-facebook.svg';
import GoogleSVG from '../../assets/icons/icons8-google.svg';
import imageWallpaper from '../../assets/wallpapers/loginsignupWallpaper.png';
import ButtonComponent from '../../components/commonComponent/ButtonComponent';
import ErrorTextComponent from '../../components/commonComponent/ErrorTextComponent';
import HorizontalRuleComponent from '../../components/commonComponent/HorizontalRuleComponent';
import InputComponent from '../../components/commonComponent/InputComponent';
import SpaceComponent from '../../components/commonComponent/SpaceComponent';
import TabsComponent from '../../components/commonComponent/TabsComponent';
import TitleComponent from '../../components/commonComponent/TitleComponent';
import { useAuth } from '../../hooks/useAuth';
import { useResponsive } from '../../hooks/useResponsive';
import './SignUpLayout.scss';

function SignUpLayout() {
    const { isDesktopOrLaptop } = useResponsive();
    const [activeKey, setActiveKey] = useState<'login' | 'signup'>('login');
    const { signInWithGoogle, signInWithFacebook } = useAuth();

    const [signInWithGoogleLoading, setSignInWithGoogleLoading] = useState(false);
    const [signInWithFacebookLoading, setSignInWithFacebookLoading] = useState(false);

    const LoginForm = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');

        return (
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
                    fontSize="1.4em"
                    style={{
                        width: '100%'
                    }}
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
        );
    };

    const SignUpForm = () => {
        return <></>;
    };

    return (
        <div>
            <div className="sign-up-container">
                {isDesktopOrLaptop && (
                    <div className="wallpaperContainer">
                        <img className="wallpaper" src={imageWallpaper} alt="wallpaper" />
                    </div>
                )}
                <div className="contentContainer">
                    <div className="container">
                        <div className="sub-container">
                            <TabsComponent
                                items={[
                                    {
                                        key: 'login',
                                        label: 'Đăng nhập'
                                    },
                                    { key: 'signup', label: 'Đăng ký' }
                                ]}
                                activeKey={activeKey}
                                onChange={(activeKey) => {
                                    setActiveKey(activeKey as 'login' | 'signup');
                                }}
                            />
                            <SpaceComponent height={32} />
                            <ButtonComponent
                                style={{
                                    width: '100%'
                                }}
                                fontSize="1.4em"
                                borderColor="var(--border-color)"
                                backgroundColor="var(--bg-color)"
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
                                onClick={async () => {
                                    setSignInWithGoogleLoading(true);
                                    await signInWithGoogle();
                                    setSignInWithGoogleLoading(false);
                                }}
                                isLoading={signInWithGoogleLoading}
                            />
                            <SpaceComponent height={16} />
                            <ButtonComponent
                                style={{
                                    width: '100%'
                                }}
                                fontSize="1.4em"
                                backgroundColor="var(--bg-color)"
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
                                onClick={async () => {
                                    setSignInWithFacebookLoading(true);
                                    await signInWithFacebook();
                                    setSignInWithFacebookLoading(false);
                                }}
                                isLoading={signInWithFacebookLoading}
                            />
                            <SpaceComponent height={32} />
                            <HorizontalRuleComponent text="or email" />
                            <SpaceComponent height={16} />
                            {activeKey === 'login' && <LoginForm />}
                            {activeKey === 'signup' && (
                                <TitleComponent title="Đăng ký" fontSize="2em" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpLayout;
