import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Protect = (props) => {
  let history = useHistory();
  const [token, setToken] = useState("")


  useEffect(() => {
    let userToken = localStorage.getItem("loginToken")

    if (!userToken) {
      history.push("/");
      setTimeout(() => {
        toast('First Login!');
      }, 1000);
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default Protect