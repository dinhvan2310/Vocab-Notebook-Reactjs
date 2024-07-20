import GoogleSVG from '../assets/icons/icons8-google.svg';
import FacebookSVG from '../assets/icons/icons8-facebook.svg';
import ButtonComponent from './ButtonComponent';
import TabLinkComponent from './TabLinkComponent';
import SpaceComponent from './SpaceComponent';
import styles from './LoginFormComponent.module.css';
import HorizontalRuleComponent from './HorizontalRuleComponent';
function loginFormComponent() {
    return (
        <div className={styles['container']}>
            <div className={styles['sub-container']}>
                <div className={styles['tab-link-container']}>
                    <TabLinkComponent text="Đăng nhập" active onClick={() => {}} />
                    <SpaceComponent width={16} />
                    <TabLinkComponent text="Đăng ký" active={false} onClick={() => {}} />
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
                    onClick={() => {}}
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
                    onClick={() => {}}
                />

                <HorizontalRuleComponent text="or email" />
            </div>
        </div>
    );
}

export default loginFormComponent;
