import { useEffect, useState } from "react";

// 1. Custom hook
function useCounter(init = 0) {
    const [count, setCount] = useState(init);

    const increase = () => setCount(count + 1);

    return [count, increase];
}
// const [count, increase] = useCounter(0);

// 2. Render props
function Counter({ init = 0, children }) {
    const [count, setCount] = useState(init);

    const increase = () => setCount(count + 1);

    return children({ count, increase });
}
/**
<Counter init={0}>
    {({ count, increase }) => (
        <h1 onClick={increase}>Count is {count}</h1>
    )}
</Counter>
 */

// 3. HOC
function withCounter(WrappedComponent) {
    const Counter = () => {
        const [count, setCount] = useState(0);
        const increase = () => setCount(count + 5);

        return <WrappedComponent count={count} increase={increase} />;
    };

    return Counter;
}

// Main component
const RenderProps = withCounter(({ count, increase }) => {
    return (
        <div>
            <h1 onClick={increase}>Count is {count}</h1>
        </div>
    );
});

export default RenderProps;
