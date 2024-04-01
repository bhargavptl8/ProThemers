import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


import LoginModal from './LoginModal';

const Protect = (props) => {
  let history = useHistory();
  const [token, setToken] = useState("")

   // ModalLogin
  //  const [openModalLogin, setOpenModalLogin] = React.useState(true);
  //  const handleLoginModalOpen = () => setOpenModalLogin(true);



  useEffect(() => {
    let userToken = localStorage.getItem("loginToken")

    if (!userToken) {
      history.push("/")
    } else {
      setToken(userToken)
    }
    
  }, [])

  if (!token) {
    return <p>Loading...</p>

  }

  return (
    <>
      {props.children}
    </>
  )
}

export default Protect