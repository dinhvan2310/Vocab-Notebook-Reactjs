import { useEffect, useState } from 'react';
import FacebookSVG from '../../assets/icons/icons8-facebook.svg';
import GoogleSVG from '../../assets/icons/icons8-google.svg';
import imageWallpaper from '../../assets/wallpapers/loginsignupWallpaper.png';
import { useAuth } from '../../hooks/useAuth';
import { useResponsive } from '../../hooks/useResponsive';
import './SignUpLayout.scss';
import InputComponent from '../../components/commonComponent/Input/InputComponent';
import ErrorTextComponent from '../../components/commonComponent/ErrorText/ErrorTextComponent';
import SpaceComponent from '../../components/commonComponent/Space/SpaceComponent';
import ButtonComponent from '../../components/commonComponent/Button/ButtonComponent';
import HorizontalRuleComponent from '../../components/commonComponent/HorizontalRule/HorizontalRuleComponent';
import TitleComponent from '../../components/commonComponent/Title/TitleComponent';
import TabsComponent from '../../components/Tabs/TabsComponent';
import { useNavigate } from 'react-router-dom';

function SignUpLayout() {
    const { isDesktopOrLaptop } = useResponsive();
    const [activeKey, setActiveKey] = useState<'login' | 'signup'>('login');
    const { signInWithGoogle, signInWithFacebook } = useAuth();

    const [signInWithGoogleLoading, setSignInWithGoogleLoading] = useState(false);
    const [signInWithFacebookLoading, setSignInWithFacebookLoading] = useState(false);

    const navigate = useNavigate();

    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    const LoginForm = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');

        return (
            <>
                <InputComponent
                    style={{}}
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    onChange={(value) => {
                        setEmail(value);
                    }}
                    value={email}
                    width="100%"
                    borderType="all"
                    inputStyle={{
                        color: 'var(--secondary-text-color)',
                        fontSize: '1.6em',
                        padding: '24px 16px'
                    }}
                />
                <SpaceComponent height={32} />
                <InputComponent
                    type="password"
                    style={{}}
                    inputStyle={{
                        color: 'var(--secondary-text-color)',
                        fontSize: '1.6em',
                        padding: '24px 16px'
                    }}
                    placeholder="Nhập mật khẩu của bạn"
                    onChange={(value) => {
                        setPassword(value);
                    }}
                    value={password}
                    borderType="all"
                />
                <SpaceComponent height={32} />

                <ErrorTextComponent text={error} />
                <SpaceComponent height={8} />

                <ButtonComponent
                    fontSize="1.4em"
                    buttonWidth={'100%'}
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
                                buttonWidth={'100%'}
                                style={{
                                    width: '100%'
                                }}
                                isBorder={true}
                                fontSize="1.4em"
                                borderColor="var(--border-color)"
                                textColor="var(--secondary-text-color)"
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
                                buttonWidth={'100%'}
                                textColor="var(--secondary-text-color)"
                                fontSize="1.4em"
                                isBorder={true}
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
