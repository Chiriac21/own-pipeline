import {useState, useImperativeHandle} from 'react';
import { Button } from 'react-bootstrap'

const Toggleable = (props) => {
    const [visible, setvisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setvisible(!visible);
    }

    useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
    })

    return (
        <>
        <div style={hideWhenVisible}>
            <Button variant="dark" type="submit" onClick={toggleVisibility}>
                {props.acceptButtonLabel}
            </Button>
        </div>
        <div className="mx-auto w-50 p-3">
            <div style={showWhenVisible}>
                {props.children}
                <Button variant="danger" type="submit" onClick={toggleVisibility}
                className="mt-4">
                    {props.cancelButtonLabel}
                </Button>
            </div>
        </div>
        </>
    )

}

export default Toggleable;