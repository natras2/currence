import { TiArrowLeft } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

import React from "react";
import { IconContext, IconType } from "react-icons";

import Skeleton from "react-loading-skeleton";
/*
import * as ai from "react-icons/ai";
import * as bi from "react-icons/bi";   
import * as bs from "react-icons/bs";
import * as cg from "react-icons/cg";
import * as ci from "react-icons/ci";
import * as di from "react-icons/di";
import * as fa from "react-icons/fa";
import * as fa6 from "react-icons/fa6";
import * as fc from "react-icons/fc";
import * as fi from "react-icons/fi";
import * as gi from "react-icons/gi";
import * as go from "react-icons/go";
import * as gr from "react-icons/gr";
import * as hi from "react-icons/hi";
import * as hi2 from "react-icons/hi2";
import * as im from "react-icons/im";
import * as io from "react-icons/io";
import * as io5 from "react-icons/io5";
import * as lia from "react-icons/lia";
import * as lu from "react-icons/lu";
import * as md from "react-icons/md";
import * as pi from "react-icons/pi";
import * as ri from "react-icons/ri";
import * as rx from "react-icons/rx";
import * as si from "react-icons/si";
import * as sl from "react-icons/sl";
import * as tb from "react-icons/tb";
import * as tfi from "react-icons/tfi";
import * as ti from "react-icons/ti";
import * as vsc from "react-icons/vsc";
import * as wi from "react-icons/wi";

type IconLibraries = {
    [key: string]: Record<string, React.ComponentType>;
};

const libs: IconLibraries = {
    ai,
    bi,
    bs,
    cg,
    ci,
    di,
    fa,
    fa6,
    fc,
    fi,
    gi,
    go,
    gr,
    hi,
    hi2,
    im,
    io,
    io5,
    lia,
    lu,
    md,
    pi,
    ri,
    rx,
    si,
    sl,
    tb,
    tfi,
    ti,
    vsc,
    wi,
};


interface GetIconProps {
    lib: string;
    name: string;
}

const GetIcon: React.FC<GetIconProps> = ({ lib, name }) => {
    //console.log("Invoked GetIcon. Params: ["+ lib +", " + name + "]");
    const lib_ = libs[lib];
    if (!lib_) throw new Error(`Library "${lib}" not found`);

    const Icon = lib_[name];
    if (!Icon) throw new Error(`Icon "${name}" not found in library "${lib}"`);

    return <Icon />;
};

export default GetIcon;
*/

interface MyInterface {
    [key: string]: IconType;
}

interface IProps {
    lib: string;
    name: string;
    size?: string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    fallback?: JSX.Element | null;
}

// A mapping of libraries to their respective dynamic import statements
const libraryMap: Record<string, () => Promise<any>> = {
    ai: () => import("react-icons/ai"),
    bi: () => import("react-icons/bi"),
    bs: () => import("react-icons/bs"),
    cg: () => import("react-icons/cg"),
    ci: () => import("react-icons/ci"),
    di: () => import("react-icons/di"),
    fa: () => import("react-icons/fa"),
    fa6: () => import("react-icons/fa6"),
    fc: () => import("react-icons/fc"),
    fi: () => import("react-icons/fi"),
    gi: () => import("react-icons/gi"),
    go: () => import("react-icons/go"),
    gr: () => import("react-icons/gr"),
    hi: () => import("react-icons/hi"),
    hi2: () => import("react-icons/hi2"),
    im: () => import("react-icons/im"),
    io: () => import("react-icons/io"),
    io5: () => import("react-icons/io5"),
    lia: () => import("react-icons/lia"),
    lu: () => import("react-icons/lu"),
    md: () => import("react-icons/md"),
    pi: () => import("react-icons/pi"),
    ri: () => import("react-icons/ri"),
    rx: () => import("react-icons/rx"),
    si: () => import("react-icons/si"),
    sl: () => import("react-icons/sl"),
    tb: () => import("react-icons/tb"),
    tfi: () => import("react-icons/tfi"),
    ti: () => import("react-icons/ti"),
    vsc: () => import("react-icons/vsc"),
    wi: () => import("react-icons/wi"),
};

export const DynamicIcon: React.FC<IProps> = ({ lib, name, ...props }) => {
    if (!lib || !name) {
        console.error("Invalid library or icon name:", { lib, name });
        return <div>Could Not Find Icon</div>;
    }

    const loadIcon = libraryMap[lib];
    if (!loadIcon) {
        console.error(`Library "${lib}" is not supported.`);
        return <div>Could Not Find Icon</div>;
    }

    const Icon = React.lazy(async () => {
        try {
            const module = await loadIcon();
            const {default: any, ...rest} = module;
            const iconArray = rest as {[key: string]: IconType};
            const IconComponent = iconArray[name];
            if (!IconComponent) {
                throw new Error(`Icon "${name}" not found in library "${lib}".`);
            }
            return { default: IconComponent };
        } catch (err) {
            console.error(err);
            throw new Error(`Failed to load icon "${name}" from library "${lib}".`);
        }
    });

    const contextValue = {
        color: props.color || undefined,
        size: props.size || undefined,
        className: props.className || undefined,
        style: props.style || undefined,
    };

    return (
        <React.Suspense fallback={props.fallback || <Skeleton circle width={props.size || "1em"} />}>
            <IconContext.Provider value={contextValue}>
                <Icon />
            </IconContext.Provider>
        </React.Suspense>
    );
};
/*

interface IProps {
    lib: string,
    name: string,
    size?: string;
    color?: string;
    className?: string;
    style?: CSSProperties;
    attr?: SVGAttributes<SVGElement>;
    fallback?: JSX.Element | null;
}

export const DynamicIcon: React.FC<IProps> = ({ lib, name, ...props }) => {
    if (!lib || !name) return <div>Could Not Find Icon</div>;

    const Icon = React.lazy(async () => {
        console.log(`Importing react-icons/${lib} with icon ${name}`);
        var iconArray: any;
        await import(`react-icons/${lib}`)
            .then((module) => {
                console.log("Loaded");
                const {default: any, ...rest} = module;
                iconArray = rest as MyInterface;
            })
            .catch((error) => {
                console.error("Error", error);
            })
        return { default: iconArray[name as keyof MyInterface] };
    });

    const value: IconContext = {
        color: props.color,
        size: props.size,
        className: props.className,
        style: props.style,
        attr: props.attr
    };

    return (
        <React.Suspense fallback={props.fallback || <Skeleton circle width={value.size} />}>
            <IconContext.Provider value={value}>
                <Icon />
            </IconContext.Provider>
        </React.Suspense>
    );
};

export const DynamicIcon = loadable(async ({ lib, name }: { lib: string; name: string }) => {
    if (!lib || !name) {
        throw new Error("Library or icon name not provided.");
    }

    try {
        // Restrict dynamic imports to the list of libraries using webpackInclude
        const module = await import(
            `react-icons/${lib}`
        );
        const {default: any, ...rest} = module;
        const iconArray = rest as {[key: string]: IconType};
        const Icon = iconArray[name];
        if (!Icon) {
            throw new Error(`Icon "${name}" not found in library "${lib}".`);
        }
        return Icon;
    } catch (error) {
        console.error(`Failed to load icon "${name}" from library "${lib}":`, error);
        throw error;
    }
}, {
    fallback: <Skeleton circle />,
});
export const DynamicIcon = loadable(({ lib, name }: {lib: string, name: string}) => import(`react-icons/${lib}`).then(module => module[name]), {
    fallback: <Skeleton circle />,
});
*/
export function BackButton(props: any) {
    return (
        <Link to={props.link} id="back-arrow" onClick={(props.handler) ? props.handler : ""} style={{ textDecoration: "none", position: "relative", top: "-1rem" }}>
            <span style={{ fontSize: "40px", marginLeft: -9 }}>
                {(props.close)
                    ? <IoClose style={{ fontSize: 30, marginRight: 10 }} />
                    : <TiArrowLeft />
                }
            </span>
        </Link>
    );
}