import { MutatingDots } from  'react-loader-spinner'

function Loader(props: any) {
    return (
        <MutatingDots
            height="100"
            width="100"
            color="#000080"
            secondaryColor='#00a0ff'
            radius='12.5'
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass={`loader ${(!!props.selector) ? props.selector : ''}`}
            visible={true}
        />
    );
}

export default Loader;