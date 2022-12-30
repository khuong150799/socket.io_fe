import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'; // Add this
import { useCallback, useEffect, useRef, useState } from 'react';

const socket = io.connect('http://192.168.102.28:3000');
// const socket = socket

function App() {

  const [valueInp, setValueInp] = useState('')
  const [valueMsg, setValueMsg] = useState([])
  const [name, setName] = useState([])
  const [nameDB, setNameDB] = useState('')
  const [className, setClassName] = useState([])

useEffect(()=>{
 if(name.length === 0){
  const person = prompt('Tên bạn là gì')
  setName(prev => [...prev,person])
 }
},[])
  const handelClick = (e)=>{
e.preventDefault()
const data = {user:name,content:valueInp}
socket.emit("hello",data);
setValueInp('')
  }
  // client-side

  useEffect(()=>{
    socket.on("hello", (data) => {
      // console.log(123);
      console.log(data); // 1
      // console.log(name);
      // console.log(data.name);
      setNameDB(data.user[0])
      setValueMsg(prev=>{console.log('prev',prev)
         return [...prev,data];})
     
    })
  return ()=> socket.off("hello")
  },[])
  useEffect(()=>{
    // console.log(valueMsg);
    // console.log(nameDB == name);
    if(!!nameDB&&(nameDB == name[0])){
      // console.log(1223);
      setClassName(prev=>[...prev,true])
    }if(valueMsg.length >= 1 &&!!nameDB&&!(nameDB == name[0])){
      setClassName(prev=>[...prev,false])
    }
  },[nameDB])

  
  // Scroll to the most recent message
  const containerRef =useRef()
  useEffect(()=>{
    containerRef.current.scrollTop = containerRef.current.scrollHeight
    // console.log('containerRef.current.scrollTop',containerRef.current.scrollTop);
    // console.log('containerRef.current.scrollHeight',containerRef.current.scrollHeight);
  },[valueMsg])
  // useEffect(()=>{console.log(className);
  //   console.log('containerRef.current.scrollTop',containerRef.current.scrollTop);
  // },[className])
  return (
    <div className='wapper' >
      <div className='container' ref={containerRef}>{valueMsg.map((item,i)=>(<ul className={className[i]?'flex-end':''} key={i} id="messages">{`${item.user}: ${item.content}`}</ul>))}</div>
      <form id="form" action="">
        <input id="input" value={valueInp} onChange={e=>setValueInp(e.target.value)} /><button onClick={handelClick}>Send</button>
      </form>
    </div>
  );
}

export default App;
