import GoogleSVG from "../assets/icons/icons8-google.svg";
import FacebookSVG from "../assets/icons/icons8-facebook.svg";
import ButtonComponent from "./ButtonComponent";
import TabLinkComponent from "./TabLinkComponent";
import SpaceComponent from "./SpaceComponent";

function loginFormComponent() {
    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "coral",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    maxWidth: 600,
                    width: "80%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        backgroundColor: "white",
                    }}
                >
                    <TabLinkComponent
                        text="Đăng nhập"
                        active
                        onClick={() => {}}
                    />
                    <SpaceComponent width={16} />
                    <TabLinkComponent
                        text="Đăng ký"
                        active={false}
                        onClick={() => {}}
                    />
                </div>
                <ButtonComponent
                    icon={
                        <img
                            style={{
                                width: 24,
                                height: 24,
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
                                height: 24,
                            }}
                            src={FacebookSVG}
                        />
                    }
                    text="Đăng nhập bằng Facebook"
                    onClick={() => {}}
                />
            </div>
        </div>
    );
}

export default loginFormComponent;
