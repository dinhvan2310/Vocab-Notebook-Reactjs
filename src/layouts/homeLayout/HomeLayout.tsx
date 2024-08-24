import GridCol from '../../components/Grid/GridCol';
import GridRow from '../../components/Grid/GridRow';

function HomeLayout() {
    return (
        <>
            <GridRow gutter={[32, 16]}>
                <GridCol span={6}>
                    <h1
                        style={{
                            backgroundColor: '#f0f0f0'
                        }}>
                        Home
                    </h1>
                </GridCol>
                <GridCol span={6}>
                    <p
                        style={{
                            backgroundColor: 'red'
                        }}>
                        Welcome to the home page!
                    </p>
                </GridCol>
                <GridCol span={6}>
                    <p
                        style={{
                            backgroundColor: 'red'
                        }}>
                        Welcome to the home page!
                    </p>
                </GridCol>
            </GridRow>
        </>
    );
}

export default HomeLayout;
