import React from 'react'

const ResponsStatus = ({ message, type }) => {
    return (
        <div className='res-staus'>
            <p style={{ color: (type === "success") ? "green" : "red" }}>{message}</p>
        </div>
    )
}

export default ResponsStatus
