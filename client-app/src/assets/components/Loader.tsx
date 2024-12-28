import { MutatingDots } from  'react-loader-spinner'

function Loader(props: any) {
    return (
        <MutatingDots
            height="100"
            width="100"
            color={(!props.theme || props.theme === "light") ? "#000080" : "#84d1ff"}
            secondaryColor={(!props.theme || props.theme === "light") ? "#00a0ff" : "#0052ff"}
            radius='12.5'
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass={`loader ${(!!props.selector) ? props.selector : ''}`}
            visible={true}
        />
    );
}

export default Loader;