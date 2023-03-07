import { ReactNode } from "react";

const Container = ({ children, className }: { children: ReactNode, className?: string }) => {
    let css = "px-20";
    if(className) css += ' ' + className;

    return (
        <div className={css}>
            {children}
        </div>
    );
}

export default Container;