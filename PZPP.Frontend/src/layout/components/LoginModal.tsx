import { Tabs } from "devextreme-react/tabs";
import { useState } from "react";
import LoginTab from "./LoginTab";
import RegisterTab from "./RegisterTab";


const LoginModal = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        {
            id: 0,
            text: 'Logowanie',
            icon: 'user',
        },
        {
            id: 1,
            text: 'Rejestracja',
            icon: 'add',
        }
    ];

    return (
        <div>
            <Tabs
                dataSource={tabs}
                selectedIndex={tab}
                keyExpr="id"
                onSelectedIndexChange={(e) => setTab(e)}
            />

            <div className="pt-5 pb-10">
                {tab == 0 && <>
                    <LoginTab />
                </>}

                {tab == 1 && <>
                    <RegisterTab />
                </>}
            </div>
        </div>
    )
}

export default LoginModal;