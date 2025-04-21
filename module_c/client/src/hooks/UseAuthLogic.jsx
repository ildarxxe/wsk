import React from 'react';

export const UseAuthLogic = () => {
    const [visible, setVisible] = React.useState(false);
    const toggleVisibility = React.useCallback(() => {
        setVisible(prevVisible => !prevVisible);
    }, [])
    return [visible, toggleVisibility];
};