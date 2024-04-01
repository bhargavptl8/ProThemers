import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const AdminProtect = (props) => {
    let history = useHistory(); 
    const [token, setToken] = useState("")

    useEffect(() => {
        let adminToken = localStorage.getItem("adminToken")

        if(!adminToken){
            return history.push("/admin/login")
        }
        setToken(adminToken)
    }, [])

    if(!token){
        return <p>Loading...</p>
    }

  return (
    <>
    {props.children}
    </>
  )
}

export default AdminProtect