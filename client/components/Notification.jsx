import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)

    if(!notification.message)
        return null;
    
    const baseStyle = {
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    };

    const messageStyle = {
        ...baseStyle,
        color: notification.type === 'error' ? 'red' : 'green',
        borderColor: notification.type === 'error' ? 'red' : 'green',
    };

    return (
        <div style={messageStyle}>
            {notification.message}
        </div>
    );
}

export default Notification