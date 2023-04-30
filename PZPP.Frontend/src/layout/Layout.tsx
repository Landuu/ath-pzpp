import Button from "devextreme-react/button";
import DropDownButton from "devextreme-react/drop-down-button";
import { Menu } from "devextreme-react/menu";
import Popup from "devextreme-react/popup";
import { ItemClickEvent } from "devextreme/ui/drop_down_button";
import { useAtom, useAtomValue } from "jotai";
import { IoBagOutline, IoChevronDown, IoCubeOutline, IoHomeOutline, IoLink, IoLinkOutline } from "react-icons/io5";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { atomCart } from "../atoms";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "../hooks/useUserContext";
import LoginModal from "./components/LoginModal";
import { atomRenderLogin, atomShowLogin } from "./layoutAtoms";

type ProfileDropdownOption = {
    id: number
    text: string
    icon: string
}

const products = [
    {
        id: '1',
        name: 'Strona główna',
        href: '/',
        nav: true,
        ico: <IoHomeOutline />
    },
    {
        id: '2',
        name: 'Nasze produkty',
        nav: true,
        ico: <IoCubeOutline />,
        items: [
            {
                id: '2_1',
                name: 'SuperLCD 42',
                href: '/',
                icon: '',
                ico: <IoBagOutline />,
            },
            {
                id: '2_2',
                name: 'SuperLED 42',
                href: '/products',
                ico: <IoBagOutline />,
            },
            {
                id: '2_3',
                name: 'SuperLED 50',
                href: '/products',
                ico: <IoBagOutline />,
            },
            {
                id: '2_4',
                name: 'SuperLCD 55',
                href: '/product',
                ico: <IoBagOutline />,
            },
            {
                id: '2_5',
                name: 'SuperLCD 70',
                href: '/product',
                ico: <IoBagOutline />,
            }
        ],
    }
];

const getDropdownOptions = (isAdmin?: boolean) => {
    const adminDropdownOption: ProfileDropdownOption = {
        id: 0,
        text: "Panel administracyjny",
        icon: 'add'
    };

    const profileDropdownOptions: ProfileDropdownOption[] = [
        {
            id: 1,
            text: 'Twoje konto',
            icon: 'user'
        },
        {
            id: 2,
            text: 'Twoje zamówienia',
            icon: 'alignleft'
        },
        {
            id: 3,
            text: 'Wyloguj',
            icon: 'undo'
        }
    ];

    if (isAdmin) return [adminDropdownOption, ...profileDropdownOptions];
    return profileDropdownOptions;
}


const Layout = () => {
    const { user, logoutUser } = useUserContext();
    const showToast = useToast();
    const [showLogin, setShowLogin] = useAtom(atomShowLogin);
    const [renderLogin, setRenderLogin] = useAtom(atomRenderLogin);
    const navigate = useNavigate();
    const dropdownOptions = getDropdownOptions(user?.IsAdmin);
    const cart = useAtomValue(atomCart);


    const handleDropdownClick = (e: ItemClickEvent) => {
        const item: ProfileDropdownOption = e.itemData;
        if (item.id == 0) {
            navigate('/admin');
        } else if (item.id == 1) {
            navigate('/account');
        } else if (item.id == 2) {
            navigate('/orders');
        } else if (item.id == 3) {
            logoutUser();
        }
    }

    return (<>
        <nav className="w-full px-20 py-3 shadow-lg flex justify-between">
            <div className="flex items-center space-x-4">
                <img src={logo} className="h-9" />
                <Menu dataSource={products}
                    displayExpr="name"
                    showFirstSubmenuMode='onHover'
                    orientation='horizontal'
                    hideSubmenuOnMouseLeave={true}
                    itemComponent={MenuItem}
                />
            </div>
            <div className="flex space-x-2">
                <Link to='/cart'>
                    <Button icon="cart" text={`Koszyk (${cart.length})`} />
                </Link>
                {user
                    ? <>
                        <div>
                            <DropDownButton
                                text={user.Name}
                                icon="user"
                                width={220}
                                items={dropdownOptions}
                                onItemClick={handleDropdownClick}
                            />
                        </div>
                    </>
                    : <Button type="default" icon='unlock' text="Logowanie" onClick={() => { setRenderLogin(true); setShowLogin(true); }} />
                }
            </div>
        </nav>

        {renderLogin && <Popup
            maxWidth={600}
            height='auto'
            dragEnabled={false}
            hideOnOutsideClick={true}
            visible={showLogin}
            contentComponent={LoginModal}
            onHiding={() => setShowLogin(false)}
            onHidden={() => setRenderLogin(false)}
        />}


        <Outlet />
    </>);
}


const MenuItem = ({ data }: { data: any }) => {
    if (data.nav) {
        const element = (
            <div className="flex items-center px-2 py-1">
                {data.ico &&
                    <div className="mr-1 text-lg">
                        {data.ico}
                    </div>
                }
                <div>
                    {data.name}
                </div>
            </div>
        );

        if (data.href) {
            return (
                <Link to={data.href}>
                    {element}
                </Link>
            )
        }

        return element;
    }

    const element = (
        <div className="flex items-center px-3 pr-10">
            {data.ico &&
                <div className="mr-2 text-lg">
                    {data.ico}
                </div>
            }
            <div>
                {data.name}
            </div>
        </div>
    );

    if (data.href) {
        return (
            <Link to={data.href}>
                {element}
            </Link>
        )
    }

    return element;
}


export default Layout;